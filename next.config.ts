import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = process.env.NEXT_PUBLIC_BASE_PATH || "/indofishmart.id";

const nextConfig: NextConfig = isGithubPages
  ? {
      output: "export",
      basePath: githubPagesBasePath,
      trailingSlash: true,
      images: { unoptimized: true },
      experimental: { cpus: 2 },
    }
  : {};

export default nextConfig;
