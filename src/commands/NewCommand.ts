import { Catalog } from "../catalog/Catalog";
import { Environment } from "../models/Environment";
import { ApplicationRequest } from "../requests/ApplicationRequest";
import { ClusterRequest } from "../requests/ClusterRequest";
import { item } from "../ui/Items";
import { VSCodeUI } from "../ui/VSCodeUI";
import { YamlWriter } from "../writer/YamlWriter";
import * as vscode from "vscode";
import { Project } from "../models/Project";
import { Application } from "../models/Application";

export enum ResourceKind {
  Application = "Application",
  Project = "Project",
  Environment = "Environment",
  Cluster = "Cluster",
}

export class NewCommand {
  constructor(
    private readonly catalog: Catalog,
    private readonly writer: YamlWriter,
  ) {}

  async execute() {
    const type = await vscode.window.showQuickPick(
      [
        ResourceKind.Application,
        ResourceKind.Project,
        ResourceKind.Environment,
        ResourceKind.Cluster,
      ],
      {
        title: "What do you want to create?",
      },
    );

    switch (type) {
      case ResourceKind.Application:
        await this.newApplication();
        break;

      case ResourceKind.Project:
        await this.newProject();
        break;

      case ResourceKind.Cluster:
        await this.newCluster();
        break;

      default:
        vscode.window.showInformationMessage("Coming soon...");
    }
  }

  private async newApplication(): Promise<void> {
    const request = await this.buildApplicationRequest();

    if (!request) {
      return;
    }

    // const project: Project = {
    //   name: request.environment.project,
    // };

    // this.writer.save("projects", project.name, project);

    const app: Application = {
      name: request.name,
      environment: request.environment.name,
      repoURL: request.environment.repoURL,
      path: `charts/${request.name}`,
      project: request.environment.project,
    };

    const file = this.writer.save("applications", app.name, app);
    const doc = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage(
      `Application '${request.name}' created.`,
    );
  }

  private async buildApplicationRequest(): Promise<
    ApplicationRequest | undefined
  > {
    const name = await this.askName(ResourceKind.Application);

    if (!name) {
      return;
    }

    const environment = await this.askEnvironment();

    if (!environment) {
      return;
    }

    return {
      name,
      environment,
    };
  }

  private async askName(item: string): Promise<string | undefined> {
    return vscode.window.showInputBox({
      title: `${item} Name`,
      prompt: `Enter ${item} name`,
      ignoreFocusOut: true,
    });
  }

  private async askEnvironment(): Promise<Environment | undefined> {
    const environments = this.catalog.getEnvironments();

    const selected = await vscode.window.showQuickPick(
      environments.map((env) => item(env.name, env, env.project, env.cluster)),
      {
        title: "Environment",
        ignoreFocusOut: true,
      },
    );

    return selected?.value;
  }

  private async newProject() {
    const name = await vscode.window.showInputBox({
      title: "Project Name",
    });

    if (!name) {
      return;
    }

    const desc = await vscode.window.showInputBox({
      title: "Project Description",
    });

    const project: Project = {
      name: name,
      description: desc,
    };

    const file = this.writer.save("projects", project.name, project);
    const doc = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage(`${name}.yaml created`);
  }

  private async newCluster() {
    const request = await this.buildClusterRequest();

    if (!request) {
      return;
    }

    const cluster = {
      name: request.name,
      server: request.server,
    };

    const file = this.writer.save("clusters", request.name, cluster);
    const doc = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(doc);

    vscode.window.showInformationMessage(`${request.name}.yaml created`);
  }

  private async buildClusterRequest(): Promise<ClusterRequest | undefined> {
    const name = await this.askName(ResourceKind.Cluster);

    if (!name) {
      return;
    }

    const server = await VSCodeUI.prototype.askServer.call(this);

    if (!server) {
      return;
    }

    return {
      name,
      server,
    };
  }
}
