import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "dist", "manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const missingFiles = [];
const contentScriptsWithImports = [];

for (const contentScript of manifest.content_scripts ?? []) {
  for (const jsFile of contentScript.js ?? []) {
    const fullPath = join(root, "dist", jsFile);
    let code = "";
    try {
      code = readFileSync(fullPath, "utf8");
    } catch {
      missingFiles.push(jsFile);
      continue;
    }

    if (/^\s*import(?:\s|[{"'])/m.test(code)) {
      contentScriptsWithImports.push(jsFile);
    }
  }
}

if (manifest.background?.service_worker) {
  try {
    readFileSync(join(root, "dist", manifest.background.service_worker), "utf8");
  } catch {
    missingFiles.push(manifest.background.service_worker);
  }
}

if (missingFiles.length > 0 || contentScriptsWithImports.length > 0) {
  if (missingFiles.length > 0) {
    console.error(`Missing dist files: ${missingFiles.join(", ")}`);
  }
  if (contentScriptsWithImports.length > 0) {
    console.error(
      `Content scripts must be standalone regular scripts, but these contain ESM imports: ${contentScriptsWithImports.join(", ")}`
    );
  }
  process.exit(1);
}
