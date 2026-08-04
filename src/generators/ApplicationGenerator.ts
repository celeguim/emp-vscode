import { Catalog } from "../catalog/Catalog";
import { Application } from "../models/Application";
import { Project } from "../models/Project";
import { ApplicationRequest } from "../requests/ApplicationRequest";
import { ApplicationResult } from "../results/ApplicationResult";

export class ApplicationGenerator {
  constructor(private readonly catalog: Catalog) {}

  create(request: ApplicationRequest): ApplicationResult {
    const app: Application = {
      name: request.name,
      environment: request.environment.name,
      repoURL: request.environment.repoURL,
      path: `charts/${request.name}`,
    };

    const project: Project = {
      name: request.environment.project,
    };

    return {
      objects: [
        {
          folder: "applications",
          name: app.name,
          object: app,
        },
        {
          folder: "projects",
          name: project.name,
          object: project,
        },
      ],
    };

    // return {
    //   application: app,
    //   project: project,
    // };
  }
}
