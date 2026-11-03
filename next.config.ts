import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const basePath = githubPages ? (process.env.PAGES_BASE_PATH ?? "/a-tel") : "";

const config: NextConfig = {
  ...(githubPages && {
    output: "export",
    basePath,
    trailingSlash: true,
    images: { unoptimized: true },
  }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: String(githubPages),
  },
};
export default config;
