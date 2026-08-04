import * as fs from "fs";
import * as path from "path";

import { Environment } from "../models/Environment";
import { Catalog } from "./Catalog";
import { Application } from "../models/Application";
import { Project } from "../models/Project";
import { parse } from "yaml";

export class FilesystemCatalog implements Catalog {
  constructor(private readonly root: string) {}

  getRoot(): string {
    return this.root;
  }

  // getEnvironments(): Environment[] {
  //   return this.list("environments").map((file) => this.loadEnvironment(file));
  // }

  getEnvironments(): Environment[] {
    return this.list("environments").map((file) =>
      this.load<Environment>("environments", file),
    );
  }

  getApplications(): Application[] {
    return this.list("applications").map((file) => ({
      name: path.basename(file, ".yaml"),
      environment: "",
      repoURL: "",
      path: "",
    }));
  }

  getProjects(): Project[] {
    return this.list("projects").map((file) => ({
      name: path.basename(file, ".yaml"),
      file: path.join(this.root, "catalog", "projects", file),
    }));
  }

  private loadEnvironment(file: string): Environment {
    const filename = path.join(this.root, "catalog", "environments", file);
    const text = fs.readFileSync(filename, "utf8");
    return parse(text) as Environment;
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
