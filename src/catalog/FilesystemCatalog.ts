import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";

import { Environment } from "../models/Environment";
import { Catalog } from "./Catalog";
import { Application } from "../models/Application";
import { Project } from "../models/Project";
import { Cluster } from "../models/Cluster";

export class FilesystemCatalog implements Catalog {
  constructor(private readonly root: string) {}

  getRoot(): string {
    return this.root;
  }

  getClusters(): Cluster[] {
    // return this.list("clusters").map((file) => ({
    //   name: path.basename(file, ".yaml"),
    //   server: "",
    // }));
    return this.load<Cluster>("clusters");
  }

  getEnvironments(): Environment[] {
    // const dir = path.join(this.root, "catalog", "environments");

    // if (!fs.existsSync(dir)) {
    //   return [];
    // }

    // return fs
    //   .readdirSync(dir)
    //   .filter((f) => f.endsWith(".yaml"))
    //   .map((f) => {
    //     const file = path.join(dir, f);
    //     const env = YAML.parse(fs.readFileSync(file, "utf8")) as Environment;
    //     env.file = file;
    //     return env;
    //   })
    //   .sort((a, b) => a.name.localeCompare(b.name));
    return this.load<Environment>("environments");
  }

  getApplications(): Application[] {
    // return this.list("applications").map((file) => ({
    //   name: path.basename(file, ".yaml"),
    //   environment: "",
    //   repoURL: "",
    //   path: "",
    //   project: "",
    // }));
    return this.load<Application>("applications");
  }

  getProjects(): Project[] {
    return this.load<Project>("projects");
  }

  // private list(folder: string): string[] {
  //   const dir = path.join(this.root, "catalog", folder);

  //   if (!fs.existsSync(dir)) {
  //     return [];
  //   }

  //   return fs
  //     .readdirSync(dir)
  //     .filter((f) => f.endsWith(".yaml"))
  //     .sort();
  // }

  private load<T>(folder: string): T[] {
    const dir = path.join(this.root, "catalog", folder);

    if (!fs.existsSync(dir)) {
      return [];
    }

    return fs
      .readdirSync(dir)
      .filter((file) => file.endsWith(".yaml"))
      .map((file) => {
        const filename = path.join(dir, file);
        return YAML.parse(fs.readFileSync(filename, "utf8")) as T;
      });
  }
}
