const esbuild = require("esbuild");

esbuild.build({
  entryPoints: ["src/extension.ts"],
  bundle: true,
  platform: "node",
  format: "cjs",
  outfile: "out/extension.js",
  external: ["vscode"],
  sourcemap: false,
  minify: false,
}).catch(() => process.exit(1));
