import type { NextConfig } from "next";
import { fileURLToPath } from "url";
import path from "path";
import { BASE_PATH } from "./src/lib/base-path";

const appDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  basePath: BASE_PATH || undefined,
  transpilePackages: ["@phmc/demo-data"],
  // Pin Turbopack root to this app — avoids wrong inference when apps/package-lock.json exists
  turbopack: {
    root: appDir,
  },
};

export default nextConfig;
