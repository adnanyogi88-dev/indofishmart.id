#!/usr/bin/env python3
"""Restore Indofishmart article images from a WordPress export and Wayback CDX.

The script keeps an auditable distinction between exact featured-image matches
and contextual fallbacks. Exact images are matched through WordPress
``_thumbnail_id`` metadata or recovered Markdown front matter. When an exact
binary was never archived, the nearest topical image from the recovered
Indofishmart collection is used so article cards do not repeat a tiny generic
fallback set.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import tempfile
import unicodedata
import xml.etree.ElementTree as ET
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Any
from urllib.parse import unquote, urlparse

from import_wordpress import child_text, normalize_slug, post_meta


ROOT = Path(__file__).resolve().parents[1]
SIZE_SUFFIX = re.compile(r"-[0-9]+x[0-9]+(?=\.[a-z0-9]+$)")
IMAGE_SIZE = re.compile(r"-([0-9]+)x([0-9]+)(?=\.[a-z0-9]+$)")
WORD = re.compile(r"[a-z0-9]+")
STOP_WORDS = {
    "agar", "akan", "anda", "apa", "atau", "bagi", "bisa", "cara", "dan",
    "dari", "dengan", "di", "ikan", "indofishmart", "ini", "ke", "makanan",
    "makan", "mengenal", "modern", "peluang", "produk", "untuk", "yang",
}


def json_bytes(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")


def url_path_key(url: str) -> str:
    path = unquote(urlparse(url).path)
    return unicodedata.normalize("NFKC", path).lower()


def url_base_key(url: str) -> str:
    return SIZE_SUFFIX.sub("", url_path_key(url))


def capture_preference(capture: tuple[str, str, str]) -> tuple[int, int]:
    _, url, _ = capture
    path = url_path_key(url)
    match = IMAGE_SIZE.search(path)
    if not match:
        return (0, 0)
    return (1, -(int(match.group(1)) * int(match.group(2))))


def article_tokens(*values: str) -> set[str]:
    text = " ".join(values).lower().replace("frozen food", "frozenfood")
    return {
        token for token in WORD.findall(unicodedata.normalize("NFKD", text))
        if len(token) > 3 and token not in STOP_WORDS
    }


def load_metadata() -> tuple[list[Path], list[dict[str, Any]]]:
    paths = sorted((ROOT / "content" / "article-data").glob("meta-*.json"))
    return paths, [article for path in paths for article in json.loads(path.read_text(encoding="utf-8"))]


def load_frontmatter_images() -> dict[str, str]:
    images: dict[str, str] = {}
    for path in (ROOT / "ARTIKEL_MD").glob("*.md"):
        text = path.read_text(encoding="utf-8")[:5000]
        slug_match = re.search(r'^slug:\s*"([^"]+)"', text, re.MULTILINE)
        image_match = re.search(r'^image:\s*"([^"]+)"', text, re.MULTILINE)
        if slug_match and image_match:
            images[normalize_slug(slug_match.group(1))] = image_match.group(1)
    return images


def load_wordpress(xml_path: Path) -> tuple[dict[str, ET.Element], dict[str, str]]:
    posts: dict[str, ET.Element] = {}
    attachments: dict[str, str] = {}
    root = ET.parse(xml_path).getroot()
    for item in root.findall("./channel/item"):
        post_type = child_text(item, "wp:post_type")
        if post_type == "attachment":
            attachments[child_text(item, "wp:post_id")] = child_text(item, "wp:attachment_url")
        elif post_type == "post" and child_text(item, "wp:status") == "publish":
            posts[normalize_slug(child_text(item, "wp:post_name"))] = item
    return posts, attachments


def load_captures(cdx_path: Path) -> tuple[dict[str, tuple[str, str, str]], dict[str, list[tuple[str, str, str]]]]:
    rows = json.loads(cdx_path.read_text(encoding="utf-8"))[1:]
    exact: dict[str, tuple[str, str, str]] = {}
    by_base: dict[str, list[tuple[str, str, str]]] = {}
    for timestamp, url, mime, _status in rows:
        capture = (timestamp, url, mime)
        exact.setdefault(url_path_key(url), capture)
        by_base.setdefault(url_base_key(url), []).append(capture)
    for captures in by_base.values():
        captures.sort(key=capture_preference)
    return exact, by_base


def select_exact_capture(
    slug: str,
    posts: dict[str, ET.Element],
    attachments: dict[str, str],
    frontmatter: dict[str, str],
    exact: dict[str, tuple[str, str, str]],
    by_base: dict[str, list[tuple[str, str, str]]],
) -> tuple[tuple[str, str, str], str, str] | None:
    frontmatter_url = frontmatter.get(slug, "")
    if frontmatter_url and url_path_key(frontmatter_url) in exact:
        return exact[url_path_key(frontmatter_url)], "frontmatter-exact", frontmatter_url

    post = posts.get(slug)
    if post is None:
        return None
    original_url = attachments.get(post_meta(post).get("_thumbnail_id", ""), "")
    if not original_url:
        return None
    if url_path_key(original_url) in exact:
        return exact[url_path_key(original_url)], "attachment-exact", original_url
    captures = by_base.get(url_base_key(original_url), [])
    if captures:
        return captures[0], "attachment-variant", original_url
    return None


def restored_filename(capture: tuple[str, str, str]) -> str:
    digest = hashlib.sha256(capture[1].encode("utf-8")).hexdigest()[:16]
    return f"{digest}.webp"


def download_capture(capture: tuple[str, str, str], output_dir: Path) -> tuple[str, bool, str]:
    timestamp, original_url, _mime = capture
    filename = restored_filename(capture)
    output_path = output_dir / filename
    if output_path.exists() and output_path.stat().st_size > 500:
        return filename, True, "cached"

    replay_url = f"https://web.archive.org/web/{timestamp}id_/{original_url}"
    with tempfile.TemporaryDirectory(prefix="indofishmart-image-") as temp_dir:
        source_path = Path(temp_dir) / "source"
        converted_path = Path(temp_dir) / "converted.webp"
        download = subprocess.run(
            [
                "curl", "-L", "--fail", "--silent", "--show-error",
                "--connect-timeout", "20", "--max-time", "90",
                "--retry", "2", "--retry-delay", "1", "--retry-all-errors",
                replay_url, "-o", str(source_path),
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        if download.returncode != 0 or not source_path.exists() or source_path.stat().st_size < 500:
            return filename, False, download.stderr.strip() or "empty archive response"

        convert = subprocess.run(
            [
                "convert", f"{source_path}[0]", "-auto-orient", "-strip",
                "-resize", "1000x600>", "-quality", "78", str(converted_path),
            ],
            capture_output=True,
            text=True,
            check=False,
        )
        if convert.returncode != 0 or not converted_path.exists() or converted_path.stat().st_size < 500:
            return filename, False, convert.stderr.strip() or "image conversion failed"
        output_path.write_bytes(converted_path.read_bytes())
    return filename, True, "downloaded"


def nearest_contextual_image(
    article: dict[str, Any],
    pool: list[dict[str, Any]],
    usage: Counter[str],
) -> dict[str, Any]:
    target = article_tokens(article["slug"], article["title"], article.get("category", ""))
    ranked: list[tuple[int, int, str, dict[str, Any]]] = []
    for source in pool:
        overlap = len(target & source["tokens"])
        ranked.append((-overlap, usage[source["image"]], source["sourceSlug"], source))
    ranked.sort(key=lambda item: item[:3])
    best_overlap = ranked[0][0]
    shortlist = [item for item in ranked if item[0] <= min(best_overlap + 1, 0)][:30]
    chosen = min(shortlist or ranked[:30], key=lambda item: (item[1], item[0], item[2]))[3]
    usage[chosen["image"]] += 1
    return chosen


def rewrite_metadata(paths: list[Path], image_by_slug: dict[str, str]) -> None:
    for path in paths:
        records = json.loads(path.read_text(encoding="utf-8"))
        for record in records:
            if record["slug"] in image_by_slug:
                record["image"] = image_by_slug[record["slug"]]
        path.write_bytes(json_bytes(records))


def build(args: argparse.Namespace) -> None:
    metadata_paths, articles = load_metadata()
    posts, attachments = load_wordpress(args.xml)
    frontmatter = load_frontmatter_images()
    exact, by_base = load_captures(args.cdx)

    exact_matches: dict[str, tuple[tuple[str, str, str], str, str]] = {}
    for article in articles:
        match = select_exact_capture(
            article["slug"], posts, attachments, frontmatter, exact, by_base
        )
        if match:
            exact_matches[article["slug"]] = match

    unique_captures = {match[0][1]: match[0] for match in exact_matches.values()}
    output_dir = ROOT / "public" / "articles" / "restored"
    output_dir.mkdir(parents=True, exist_ok=True)

    download_results: dict[str, tuple[str, bool, str]] = {}
    if args.offline:
        for url, capture in unique_captures.items():
            filename = restored_filename(capture)
            available = (output_dir / filename).exists()
            download_results[url] = (filename, available, "cached" if available else "missing")
    else:
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            futures = {
                executor.submit(download_capture, capture, output_dir): url
                for url, capture in unique_captures.items()
            }
            for index, future in enumerate(as_completed(futures), start=1):
                result = future.result()
                download_results[futures[future]] = result
                if index % 20 == 0 or index == len(futures):
                    succeeded = sum(value[1] for value in download_results.values())
                    print(f"images {index}/{len(futures)}; succeeded={succeeded}", flush=True)

    manifest: dict[str, dict[str, Any]] = {}
    image_by_slug: dict[str, str] = {}
    pool: list[dict[str, Any]] = []
    for article in articles:
        slug = article["slug"]
        local_path = ROOT / "public" / "articles" / f"{slug}.webp"
        if local_path.exists():
            image = f"/articles/{slug}.webp"
            image_by_slug[slug] = image
            manifest[slug] = {"image": image, "mode": "local-original"}
            continue

        match = exact_matches.get(slug)
        if not match:
            continue
        capture, method, original_url = match
        filename, succeeded, _message = download_results.get(capture[1], ("", False, "missing"))
        if not succeeded:
            continue
        image = f"/articles/restored/{filename}"
        replay_url = f"https://web.archive.org/web/{capture[0]}id_/{capture[1]}"
        image_by_slug[slug] = image
        manifest[slug] = {
            "image": image,
            "mode": "original",
            "method": method,
            "originalUrl": original_url,
            "archiveUrl": replay_url,
        }
        pool.append({
            "image": image,
            "sourceSlug": slug,
            "tokens": article_tokens(
                slug, article["title"], article.get("category", ""), capture[1]
            ),
        })

    if not pool:
        raise RuntimeError("No archived article images could be restored")

    usage: Counter[str] = Counter(image_by_slug.values())
    for article in articles:
        slug = article["slug"]
        if slug in image_by_slug:
            continue
        source = nearest_contextual_image(article, pool, usage)
        image_by_slug[slug] = source["image"]
        manifest[slug] = {
            "image": source["image"],
            "mode": "contextual-archive",
            "sourceArticleSlug": source["sourceSlug"],
        }

    rewrite_metadata(metadata_paths, image_by_slug)
    (ROOT / "content" / "article-image-manifest.json").write_bytes(json_bytes(manifest))

    counts = Counter(record["mode"] for record in manifest.values())
    print(json.dumps({
        "articleCount": len(articles),
        "manifestCount": len(manifest),
        "uniqueImagesUsed": len(set(image_by_slug.values())),
        "downloadedImages": sum(result[1] for result in download_results.values()),
        "modes": counts,
        "mostRepeatedImages": Counter(image_by_slug.values()).most_common(5),
    }, ensure_ascii=False, default=dict))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--xml", type=Path, required=True)
    parser.add_argument("--cdx", type=Path, required=True)
    parser.add_argument("--workers", type=int, default=12)
    parser.add_argument("--offline", action="store_true")
    build(parser.parse_args())


if __name__ == "__main__":
    main()
