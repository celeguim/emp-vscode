import { Application } from "../models/Application";

export class ApplicationBuilder {
  private app: Application = {
    name: "",
    environment: "",
    repoURL: "",
    path: "",
  };

  name(name: string): this {
    this.app.name = name;
    return this;
  }

  environment(environment: string): this {
    this.app.environment = environment;
    return this;
  }

  repoURL(repoURL: string): this {
    this.app.repoURL = repoURL;
    return this;
  }

  path(path: string): this {
    this.app.path = path;
    return this;
  }

  build(): Application {
    return this.app;
  }
}
