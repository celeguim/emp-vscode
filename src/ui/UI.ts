import { Environment } from "../models/Environment";

export interface UI {
  askApplicationName(): Promise<string | undefined>;

  askRepository(): Promise<string | undefined>;

  askPath(): Promise<string | undefined>;

  pickEnvironment(
    environments: Environment[],
  ): Promise<Environment | undefined>;

  info(message: string): void;

  error(message: string): void;
}
