import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";

import { Environment } from "../models/Environment";
import { Catalog } from "./Catalog";
import { Application } from "../models/Application";
import { Project } from "../models/Project";
import { parse } from "yaml";
import { Cluster } from "../models/Cluster";

export class FilesystemCatalog implements Catalog {
  constructor(private readonly root: string) {}

  getClusters(): Cluster[] {
    return this.list("clusters").map((file) => ({
      name: path.basename(file, ".yaml"),
      server: "",
    }));
  }

  getRoot(): string {
    return this.root;
  }

  getEnvironments(): Environment[] {
    const dir = path.join(this.root, "catalog", "environments");

    if (!fs.existsSync(dir)) {
      return [];
    }

    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".yaml"))
      .map((f) => {
        const file = path.join(dir, f);
        const env = YAML.parse(fs.readFileSync(file, "utf8")) as Environment;
        env.file = file;
        return env;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getApplications(): Application[] {
    return this.list("applications").map((file) => ({
      name: path.basename(file, ".yaml"),
      environment: "",
      repoURL: "",
      path: "",
      project: "",
    }));
  }

  getProjects(): Project[] {
    return this.list("projects").map((file) => ({
      name: path.basename(file, ".yaml"),
      file: path.join(this.root, "catalog", "projects", file),
    }));
  }

  private list(folder: string): string[] {
    const dir = path.join(this.root, "catalog", folder);

    if (!fs.existsSync(dir)) {
      return [];
    }

    return fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".yaml"))
      .sort();
  }

  private load<T>(folder: string, file: string): T {
    const filename = path.join(this.root, "catalog", folder, file);
    const text = fs.readFileSync(filename, "utf8");
    return parse(text) as T;
  }
}
