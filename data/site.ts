export const siteContact = {
  email: "halo@indofishmart.id",
  whatsapp:
    "https://wa.me/6285921327969?text=Halo%20Indofishmart%2C%20saya%20ingin%20bertanya%20mengenai%20produk%20dan%20kemitraan.",
  location: "Bekasi, Jawa Barat",
};

export const siteBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");

const vercelProductionHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
const deploymentSiteUrl = vercelProductionHost
  ? `https://${vercelProductionHost}`
  : "https://indofishmart.id";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || deploymentSiteUrl
).replace(/\/$/, "");

export function siteAsset(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (siteBasePath && (path === siteBasePath || path.startsWith(`${siteBasePath}/`))) return path;
  return `${siteBasePath}${path}`;
}

export function siteHtml(html: string) {
  if (!siteBasePath) return html;
  return html.replace(/(\s(?:href|src)=['"])\/(?!\/)/gi, `$1${siteBasePath}/`);
}
