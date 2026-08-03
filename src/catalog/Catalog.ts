import * as fs from "fs";
import * as path from "path";

import { Environment } from "../models/Environment";

export interface Catalog {
  getRoot(): string;
  getEnvironments(): Environment[];
}

// export interface Environment {
//   name: string;
//   file: string;
//   project?: string;
//   cluster?: string;
//   namespace?: string;
// }

// export interface Project {
//   name: string;
//   file: string;
// }

// export class Catalog {
//   constructor(private readonly root: string) {}

//   getEnvironments(): Environment[] {
//     const dir = path.join(this.root, "catalog", "environments");

//     if (!fs.existsSync(dir)) {
//       return [];
//     }

//     return ["ENV"].map((f) => ({
//       name: path.basename(f, ".yaml"),
//       file: path.join(dir, f),
//       environment: "dev",
//     }));

//     // return ["env1", "env1"].map((f) => ({
//     //   name: path.basename(f, ".yaml"),
//     //   file: path.join(dir, f),
//     // }));

//     // return fs
//     //   .readdirSync(dir)
//     //   .filter((f) => f.endsWith(".yaml"))
//     //   .map((f) => ({
//     //     name: path.basename(f, ".yaml"),
//     //     file: path.join(dir, f),
//     //   }))
//     //   .sort((a, b) => a.name.localeCompare(b.name));
//   }
// }

// getProjects(): Project[] {}

// getClusters(): Cluster[] {}

// getApplications(): Application[] {}
