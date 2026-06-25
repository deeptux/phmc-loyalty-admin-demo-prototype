import { BASE_PATH } from "@/lib/base-path";

/** Prefix public folder paths for production basePath (inline styles, etc.). */
export function publicAsset(path: string): string {
  if (path.startsWith("data:") || path.startsWith("http")) return path;
  return `${BASE_PATH}${path}`;
}
