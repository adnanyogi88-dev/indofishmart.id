import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  return response.text();
}

test("renders the Indofishmart landing page", async () => {
  const html = await render("/");
  assert.match(html, /Indofishmart/);
  assert.match(html, /Frozen Seafood untuk Rumah dan Usaha/);
});

test("renders the complete article directory", async () => {
  const html = await render("/artikel");
  assert.match(html, /733 artikel Indofishmart berhasil dipulihkan/);
  assert.match(html, /Ikan Asin Jambal Roti/);
});

test("renders representative recovered articles on their original URLs", async () => {
  const recent = await render(
    "/cara-membuat-sate-lilit-ikan-khas-bali-resep-praktis-untuk-ibu-rumah-tangga-modern/",
  );
  const older = await render("/resep-masakan-dari-bahan-baku-ikan-mujair/");
  assert.match(recent, /Cara Membuat Sate Lilit Ikan Khas Bali/);
  assert.match(older, /Resep Masakan dari Bahan Baku Ikan Mujair/);
});
