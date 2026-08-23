export const siteContact = {
  email: "halo@indofishmart.id",
  whatsapp: "https://wa.link/sjh2e4",
  location: "Bekasi, Jawa Barat",
};

export const siteBasePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://indofishmart.id").replace(/\/$/, "");

export function siteAsset(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  if (siteBasePath && (path === siteBasePath || path.startsWith(`${siteBasePath}/`))) return path;
  return `${siteBasePath}${path}`;
}

export function siteHtml(html: string) {
  if (!siteBasePath) return html;
  return html.replace(/(\s(?:href|src)=['"])\/(?!\/)/gi, `$1${siteBasePath}/`);
}
