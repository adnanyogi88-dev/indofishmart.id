#!/usr/bin/env python3
"""Build the production article dataset from an Indofishmart WordPress export.

Only published posts whose canonical URL appears in the retained public-crawl
manifest are included. Large article bodies are split into small JSON shards so
the site can load one body at a time without shipping the full archive to every
visitor.
"""

from __future__ import annotations

import argparse
import html as html_lib
import json
import re
import shutil
import unicodedata
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any, Iterable
from urllib.parse import unquote, urlparse

from lxml import etree, html


ROOT = Path(__file__).resolve().parents[1]
NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
    "wp": "http://wordpress.org/export/1.2/",
}

HYPHENS = re.compile(r"[‐‑‒–—―−]+")
CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
WP_BLOCK_COMMENTS = re.compile(r"<!--\s*\/?wp:.*?-->", re.DOTALL)
SHORTCODE = re.compile(r"\[(?:/?)[a-zA-Z][^\]]*\]")
SPACE = re.compile(r"\s+")

LOCAL_ARTICLE_IMAGES = {
    path.stem: f"/articles/{path.name}"
    for path in (ROOT / "public" / "articles").glob("*")
    if path.is_file()
}

ARTICLE_IMAGE_MANIFEST_PATH = ROOT / "content" / "article-image-manifest.json"
RESTORED_ARTICLE_IMAGES = (
    {
        slug: record["image"]
        for slug, record in json.loads(
            ARTICLE_IMAGE_MANIFEST_PATH.read_text(encoding="utf-8")
        ).items()
    }
    if ARTICLE_IMAGE_MANIFEST_PATH.exists()
    else {}
)


def normalize_slug(value: str) -> str:
    value = unicodedata.normalize("NFKC", unquote(value or "")).strip().strip("/")
    value = HYPHENS.sub("-", value).lower()
    value = "".join(
        char for char in unicodedata.normalize("NFKD", value)
        if not unicodedata.combining(char)
    )
    value = re.sub(r"[^a-z0-9-]+", "-", value)
    return re.sub(r"-+", "-", value).strip("-")


def crawl_slugs(path: Path) -> set[str]:
    records = json.loads(path.read_text(encoding="utf-8"))
    slugs: set[str] = set()
    for record in records:
        url = record.get("canonical_url") or record.get("url") or ""
        slug = normalize_slug(urlparse(url).path)
        if slug:
            slugs.add(slug)
    return slugs


def child_text(item: ET.Element, path: str) -> str:
    return item.findtext(path, default="", namespaces=NS) or ""


def post_meta(item: ET.Element) -> dict[str, str]:
    result: dict[str, str] = {}
    for entry in item.findall("wp:postmeta", NS):
        key = child_text(entry, "wp:meta_key")
        if key and key not in result:
            result[key] = child_text(entry, "wp:meta_value")
    return result


def canonical_internal_href(href: str) -> str:
    parsed = urlparse(html_lib.unescape(href.strip()))
    if parsed.scheme in {"mailto", "tel", "whatsapp"}:
        return href.strip()
    if parsed.netloc and parsed.netloc.lower().removeprefix("www.") != "indofishmart.id":
        return href.strip()
    if parsed.path.startswith("/wp-content/"):
        return ""
    slug = normalize_slug(parsed.path)
    if not slug:
        return "/"
    fragment = f"#{parsed.fragment}" if parsed.fragment else ""
    return f"/{slug}/{fragment}"


def unwrap(element: etree._Element) -> None:
    parent = element.getparent()
    if parent is None:
        return
    index = parent.index(element)
    if element.text:
        if index == 0:
            parent.text = (parent.text or "") + element.text
        else:
            previous = parent[index - 1]
            previous.tail = (previous.tail or "") + element.text
    for child in list(element):
        element.remove(child)
        parent.insert(index, child)
        index += 1
    if element.tail:
        if index == 0:
            parent.text = (parent.text or "") + element.tail
        else:
            previous = parent[index - 1]
            previous.tail = (previous.tail or "") + element.tail
    parent.remove(element)


def sanitize_html(raw_html: str) -> str:
    raw_html = CONTROL_CHARS.sub("", raw_html or "")
    raw_html = WP_BLOCK_COMMENTS.sub("", raw_html)
    raw_html = SHORTCODE.sub("", raw_html)
    try:
        wrapper = html.fragment_fromstring(raw_html, create_parent="div")
    except (etree.ParserError, ValueError):
        return ""

    etree.strip_elements(
        wrapper,
        "script",
        "style",
        "iframe",
        "form",
        "input",
        "button",
        "video",
        "audio",
        "source",
        "picture",
        "noscript",
        with_tail=False,
    )

    for image in list(wrapper.xpath(".//img")):
        image.drop_tree()

    allowed = {
        "a", "blockquote", "br", "code", "del", "div", "em", "figcaption",
        "figure", "h2", "h3", "h4", "h5", "hr", "li", "ol", "p", "pre",
        "span", "strong", "sub", "sup", "table", "tbody", "td", "th",
        "thead", "tr", "u", "ul",
    }
    for element in list(wrapper.iterdescendants()):
        if not isinstance(element.tag, str):
            element.drop_tree()
            continue
        tag = element.tag.lower()
        if tag not in allowed:
            unwrap(element)
            continue

        attributes: dict[str, str] = {}
        if tag == "a":
            href = canonical_internal_href(element.get("href", ""))
            if href:
                attributes["href"] = href
                parsed = urlparse(href)
                if parsed.netloc:
                    attributes["rel"] = "noopener noreferrer nofollow"
        elif tag in {"td", "th"}:
            for name in ("colspan", "rowspan"):
                value = element.get(name, "")
                if value.isdigit():
                    attributes[name] = value
        element.attrib.clear()
        element.attrib.update(attributes)

    # Remove empty wrappers while preserving structural line breaks.
    removable = {"div", "span", "p", "figure", "figcaption"}
    for element in reversed(list(wrapper.iterdescendants())):
        if (
            isinstance(element.tag, str)
            and element.tag.lower() in removable
            and not "".join(element.itertext()).strip()
            and len(element) == 0
        ):
            element.drop_tree()

    rendered = "".join(
        etree.tostring(child, encoding="unicode", method="html")
        for child in wrapper
    )
    return CONTROL_CHARS.sub("", rendered).strip()


def plain_text(raw_html: str) -> str:
    try:
        text = html.fromstring(f"<div>{raw_html}</div>").text_content()
    except (etree.ParserError, ValueError):
        text = re.sub(r"<[^>]+>", " ", raw_html)
    return SPACE.sub(" ", html_lib.unescape(text)).strip()


def excerpt_for(item: ET.Element, cleaned_html: str, meta: dict[str, str]) -> str:
    candidates = [
        meta.get("_yoast_wpseo_metadesc", ""),
        meta.get("rank_math_description", ""),
        child_text(item, "excerpt:encoded"),
        plain_text(cleaned_html),
    ]
    excerpt = next((SPACE.sub(" ", value).strip() for value in candidates if value.strip()), "")
    if len(excerpt) <= 180:
        return excerpt
    return excerpt[:177].rsplit(" ", 1)[0].rstrip(" ,.;:") + "…"


def iso_date(item: ET.Element) -> str:
    for path in ("wp:post_date_gmt", "wp:post_date"):
        value = child_text(item, path).strip()
        if value and not value.startswith("0000-"):
            try:
                parsed = datetime.strptime(value, "%Y-%m-%d %H:%M:%S")
                return parsed.replace(tzinfo=timezone.utc).isoformat().replace("+00:00", "Z")
            except ValueError:
                pass
    value = child_text(item, "pubDate")
    if value:
        try:
            return parsedate_to_datetime(value).astimezone(timezone.utc).isoformat().replace("+00:00", "Z")
        except (TypeError, ValueError):
            pass
    return ""


def local_image(slug: str, title: str, category: str) -> str:
    if slug in RESTORED_ARTICLE_IMAGES:
        return RESTORED_ARTICLE_IMAGES[slug]
    if slug in LOCAL_ARTICLE_IMAGES:
        return LOCAL_ARTICLE_IMAGES[slug]
    search = f"{slug} {title} {category}".lower()
    if "udang" in search:
        return "/images/udang-vaname.jpg"
    if "gurame" in search:
        return "/images/gurame-fillet.webp"
    if any(word in search for word in ("dori", "fillet", "pangasius")):
        return "/images/dori-fillet.webp"
    if "kerapu" in search:
        return "/images/artikel-kerapu-batik.png"
    if any(word in search for word in ("resep", "masak", "kuliner", "menu", "sate")):
        return "/images/artikel-resep-ikan.png"
    if any(word in search for word in ("outlet", "franchise", "waralaba", "bisnis", "usaha")):
        return "/images/outlet-bekasi.webp"
    return "/images/ikan-laut.jpg"


def category_for(item: ET.Element) -> str:
    categories = [
        SPACE.sub(" ", category.text or "").strip()
        for category in item.findall("category")
        if category.get("domain") == "category" and (category.text or "").strip()
    ]
    return categories[0] if categories else "Artikel"


def article_from_item(item: ET.Element, public_slugs: set[str]) -> dict[str, Any] | None:
    if child_text(item, "wp:post_type") != "post" or child_text(item, "wp:status") != "publish":
        return None
    slug = normalize_slug(child_text(item, "wp:post_name"))
    if not slug or slug not in public_slugs:
        return None
    title = SPACE.sub(" ", html_lib.unescape(child_text(item, "title"))).strip()
    cleaned_html = sanitize_html(child_text(item, "content:encoded"))
    if not title or len(plain_text(cleaned_html)) < 250:
        return None
    meta = post_meta(item)
    category = category_for(item)
    return {
        "slug": slug,
        "title": title,
        "date": iso_date(item),
        "category": category,
        "author": SPACE.sub(" ", child_text(item, "dc:creator")).strip() or "Indofishmart",
        "excerpt": excerpt_for(item, cleaned_html, meta),
        "image": local_image(slug, title, category),
        "contentHtml": cleaned_html,
    }


def json_bytes(value: Any) -> bytes:
    return (json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8")


def write_json(path: Path, value: Any) -> None:
    path.write_bytes(json_bytes(value))


def split_sequence(records: Iterable[Any], max_bytes: int) -> list[list[Any]]:
    shards: list[list[Any]] = []
    current: list[Any] = []
    for record in records:
        candidate = [*current, record]
        if current and len(json_bytes(candidate)) > max_bytes:
            shards.append(current)
            current = [record]
        else:
            current = candidate
    if current:
        shards.append(current)
    return shards


def split_bodies(articles: list[dict[str, Any]], max_bytes: int) -> list[dict[str, str]]:
    shards: list[dict[str, str]] = []
    current: dict[str, str] = {}
    for article in articles:
        candidate = {**current, article["slug"]: article["contentHtml"]}
        if current and len(json_bytes(candidate)) > max_bytes:
            shards.append(current)
            current = {article["slug"]: article["contentHtml"]}
        else:
            current = candidate
        article["bodyShard"] = len(shards)
    if current:
        shards.append(current)
    return shards


def generated_metadata_module(count: int) -> str:
    imports = "\n".join(
        f'import meta{index:03d} from "@/content/article-data/meta-{index:03d}.json";'
        for index in range(count)
    )
    values = ", ".join(f"...meta{index:03d}" for index in range(count))
    return f"{imports}\n\nexport const generatedArticleMetadata = [{values}];\n"


def generated_body_module(count: int) -> str:
    loaders = "\n".join(
        f'  {index}: () => import("@/content/article-data/body-{index:03d}.json"),'
        for index in range(count)
    )
    return f'''const bodyLoaders = {{\n{loaders}\n}} as const;\n\nexport async function loadGeneratedArticleBody(shard: number, slug: string) {{\n  const loader = bodyLoaders[shard as keyof typeof bodyLoaders];\n  if (!loader) return null;\n  const bodyModule = await loader();\n  return (bodyModule.default as Record<string, string>)[slug] ?? null;\n}}\n'''


def write_article_directory(articles: list[dict[str, Any]]) -> None:
    lines = [
        "# Daftar Artikel Indofishmart",
        "",
        f"Total artikel publik yang dipulihkan: **{len(articles)}**",
        "",
    ]
    for index, article in enumerate(articles, start=1):
        lines.append(
            f'{index}. [{article["title"]}](https://indofishmart.id/{article["slug"]}/) '
            f'— {article["category"]} — {article["date"][:10] or "Tanggal tidak tersedia"}'
        )
    (ROOT / "DAFTAR-ARTIKEL.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def build(xml_path: Path, crawl_path: Path, max_shard_bytes: int) -> None:
    public_slugs = crawl_slugs(crawl_path)
    articles_by_slug: dict[str, dict[str, Any]] = {}
    privacy_html = ""

    for _, item in ET.iterparse(xml_path, events=("end",)):
        if not item.tag.endswith("item"):
            continue
        article = article_from_item(item, public_slugs)
        if article:
            articles_by_slug[article["slug"]] = article
        if (
            child_text(item, "wp:post_type") == "page"
            and child_text(item, "wp:status") == "publish"
            and normalize_slug(child_text(item, "wp:post_name")) == "privacy-policy-indofishmart-id"
        ):
            privacy_html = sanitize_html(child_text(item, "content:encoded")).replace(
                "{isi tanggal}", "23 Agustus 2026"
            )
        item.clear()

    articles = sorted(
        articles_by_slug.values(),
        key=lambda article: (article["date"], article["slug"]),
        reverse=True,
    )
    if len(articles) < 700:
        raise RuntimeError(f"Expected at least 700 public posts, found {len(articles)}")

    output = ROOT / "content" / "article-data"
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)

    body_shards = split_bodies(articles, max_shard_bytes)
    metadata = [
        {key: value for key, value in article.items() if key != "contentHtml"}
        for article in articles
    ]
    metadata_shards = split_sequence(metadata, max_shard_bytes)

    for index, shard in enumerate(body_shards):
        write_json(output / f"body-{index:03d}.json", shard)
    for index, shard in enumerate(metadata_shards):
        write_json(output / f"meta-{index:03d}.json", shard)

    manifest = {
        "articleCount": len(articles),
        "bodyShardCount": len(body_shards),
        "metadataShardCount": len(metadata_shards),
        "selection": "Published WordPress posts with a URL in DATA-ARSIP-COMMONCRAWL.json",
        "source": xml_path.name,
    }
    write_json(ROOT / "content" / "articles.json", manifest)
    write_json(ROOT / "content" / "pages" / "privacy-policy.json", {"contentHtml": privacy_html})
    (ROOT / "data" / "article-metadata.generated.ts").write_text(
        generated_metadata_module(len(metadata_shards)), encoding="utf-8"
    )
    (ROOT / "data" / "article-content.generated.ts").write_text(
        generated_body_module(len(body_shards)), encoding="utf-8"
    )
    write_article_directory(articles)
    print(json.dumps(manifest, ensure_ascii=False))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--xml", type=Path, required=True)
    parser.add_argument(
        "--crawl",
        type=Path,
        default=ROOT / "DATA-ARSIP-COMMONCRAWL.json",
    )
    parser.add_argument("--max-shard-bytes", type=int, default=90_000)
    args = parser.parse_args()
    (ROOT / "content" / "pages").mkdir(parents=True, exist_ok=True)
    build(args.xml.resolve(), args.crawl.resolve(), args.max_shard_bytes)


if __name__ == "__main__":
    main()
