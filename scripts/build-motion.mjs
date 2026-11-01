import { build } from "esbuild";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(".");
const outdir = resolve(root, "design/prototypes/assets/motion");
const chunks = resolve(outdir, "chunks");

await mkdir(outdir, { recursive: true });
await rm(chunks, { recursive: true, force: true });
await rm(resolve(outdir, "motion.js"), { force: true });

const result = await build({
  absWorkingDir: root,
  entryPoints: { motion: "design/motion/src/main.js" },
  outdir,
  bundle: true,
  splitting: true,
  format: "esm",
  entryNames: "[name]",
  chunkNames: "chunks/[name]-[hash]",
  minify: true,
  sourcemap: false,
  target: ["es2020"],
  legalComments: "none",
  metafile: true,
  logLevel: "info"
});

await mkdir(resolve(root, ".research"), { recursive: true });
await writeFile(
  resolve(root, ".research/motion-metafile.json"),
  JSON.stringify(result.metafile, null, 2)
);
