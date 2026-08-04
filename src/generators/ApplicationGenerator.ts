import { Catalog } from "../catalog/Catalog";
import { Environment } from "../models/Environment";

export class ApplicationGenerator {
  constructor(private readonly catalog: Catalog) {}

  static create(name: string, environment: Environment) {
    return {
      application: {
        name,
        environment: environment.name,
        repoURL: environment.repoURL,
        path: `charts/${name}`,
      },

      project: {
        name: environment.project,
      },
    };
  }
}
