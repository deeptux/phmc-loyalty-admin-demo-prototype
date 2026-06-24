import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";
import { BASE_PATH } from "./src/lib/base-path";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
  basePath: BASE_PATH || undefined,
  transpilePackages: ["@phmc/demo-data"],
  turbopack: {
    root: rootDir,
  },
};

export default nextConfig;
