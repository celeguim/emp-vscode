import { Catalog } from "../catalog/Catalog";
import { Project } from "../models/Project";
import { ProjectRequest } from "../requests/ProjectRequest";
import { ProjectResult } from "../results/ProjectResult";

export class ProjectGenerator {
  constructor(private readonly catalog: Catalog) {}

  create(request: ProjectRequest): ProjectResult {
    const project: Project = {
      name: request.name,
      description: request.description,
    };

    return {
      objects: [
        {
          folder: "projects",
          name: project.name,
          object: project,
        },
      ],
    };
  }
}
