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
    return this.load<Cluster>("clusters");
  }

  getEnvironments(): Environment[] {
    return this.load<Environment>("environments");
  }

  getApplications(): Application[] {
    return this.load<Application>("applications");
  }

  getProjects(): Project[] {
    return this.load<Project>("projects");
  }

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
