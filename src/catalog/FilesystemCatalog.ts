import * as fs from "fs";
import * as path from "path";

import { Environment } from "../models/Environment";
import { Catalog } from "./Catalog";

export class FilesystemCatalog implements Catalog {
  constructor(private readonly root: string) {}

  getRoot(): string {
    return this.root;
  }

  getEnvironments(): Environment[] {
    const dir = path.join(this.root, "catalog", "environments");

    if (!fs.existsSync(dir)) {
      return [];
    }

    return ["ENV"].map((f) => ({
      name: path.basename(f, ".yaml"),
      file: path.join(dir, f),
      environment: "dev",
      repoURL: "https://github.com/celeguim/gitops.git",
      project: "default",
    }));

    // return fs
    //   .readdirSync(dir)
    //   .filter((f) => f.endsWith(".yaml"))
    //   .map((f) => ({
    //     name: path.basename(f, ".yaml"),
    //     file: path.join(dir, f),
    //   }))
    //   .sort((a, b) => a.name.localeCompare(b.name));
  }
}
