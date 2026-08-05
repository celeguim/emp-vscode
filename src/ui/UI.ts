import { Environment } from "../models/Environment";
import { Project } from "../models/Project";

export interface UI {
  askApplicationName(): Promise<string | undefined>;
  askRepository(): Promise<string | undefined>;
  askPath(): Promise<string | undefined>;

  pickEnvironment(
    environments: Environment[],
  ): Promise<Environment | undefined>;

  pickProject(projects: Project[]): Promise<Project | undefined>;

  info(message: string): void;
  error(message: string): void;
}
