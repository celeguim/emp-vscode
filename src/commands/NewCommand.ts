import { Catalog } from "../catalog/Catalog";
import { Environment } from "../models/Environment";
import { ApplicationRequest } from "../requests/ApplicationRequest";
import { ClusterRequest } from "../requests/ClusterRequest";
import { YamlWriter } from "../writer/YamlWriter";
import * as vscode from "vscode";
import { Project } from "../models/Project";
import { Application } from "../models/Application";
import { Cluster } from "../models/Cluster";

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

      case ResourceKind.Environment:
        await this.newEnvironment();
        break;

      default:
        vscode.window.showInformationMessage("Coming soon...");
    }
  }

  private async newEnvironment(): Promise<void> {
    const name = await this.askName(ResourceKind.Environment);

    if (!name) {
      return;
    }

    const project = await this.askProject();

    if (!project) {
      return;
    }

    const cluster = await this.askCluster();

    if (!cluster) {
      return;
    }

    const repoURL = await this.askRepository();

    if (!repoURL) {
      return;
    }

    const targetRevision = await this.askTargetRevision();

    if (!targetRevision) {
      return;
    }

    const environment: Environment = {
      name,
      project: project.name,
      cluster: cluster.name,
      repoURL,
      targetRevision,
    };

    const file = this.writer.save(
      "environments",
      environment.name,
      environment,
    );

    await this.open(file);

    vscode.window.showInformationMessage(
      `Environment '${environment.name}' created.`,
    );
  }

  private async newApplication(): Promise<void> {
    const request = await this.buildApplicationRequest();

    if (!request) {
      return;
    }

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
    interface EnvironmentItem extends vscode.QuickPickItem {
      environment: Environment;
    }

    const environments = this.catalog.getEnvironments();

    if (environments.length === 0) {
      vscode.window.showWarningMessage(
        "No environments found. Create an Environment first.",
      );
      return undefined;
    }

    const items: EnvironmentItem[] = environments.map((e) => ({
      label: `$(server) ${e.name}`,
      description: `${e.project} • ${e.cluster}`,
      detail: `${e.repoURL} (${e.targetRevision})`,
      environment: e,
    }));

    const selected = await vscode.window.showQuickPick(items, {
      title: "Select Environment",
      placeHolder: "Choose the target environment",
      matchOnDescription: true,
      matchOnDetail: true,
    });

    return selected?.environment;
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

    const server = await this.askServer(name);

    if (!server) {
      return;
    }

    return {
      name,
      server,
    };
  }

  private async askServer(item: string): Promise<string | undefined> {
    return vscode.window.showInputBox({
      title: "Cluster URL",
      prompt: "https://kubernetes.default.svc",
      ignoreFocusOut: true,
    });
  }

  private async askProject(): Promise<Project | undefined> {
    const projects = this.catalog.getProjects();

    if (projects.length === 0) {
      vscode.window.showWarningMessage(
        "No projects found. Create a Project first.",
      );
      return;
    }

    const selected = await vscode.window.showQuickPick(
      projects.map((project) => ({
        label: project.name,
        project,
      })),

      {
        title: "Project",
        placeHolder: "Select a project",
      },
    );

    return selected?.project;
  }

  private async askCluster(): Promise<Cluster | undefined> {
    const clusters = this.catalog.getClusters();

    if (clusters.length === 0) {
      vscode.window.showWarningMessage(
        "No clusters found. Create a Cluster first.",
      );
      return;
    }

    const selected = await vscode.window.showQuickPick(
      clusters.map((cluster) => ({
        label: cluster.name,
        cluster,
      })),

      {
        title: "Cluster",
        placeHolder: "Select a cluster",
      },
    );

    return selected?.cluster;
  }

  private async askRepository(): Promise<string | undefined> {
    return vscode.window.showInputBox({
      title: "Repository URL",
      placeHolder: "https://github.com/celeguim/gitops.git",
      ignoreFocusOut: true,
    });
  }

  private async askTargetRevision(): Promise<string | undefined> {
    return vscode.window.showInputBox({
      title: "Target Revision",
      value: "HEAD",
      ignoreFocusOut: true,
    });
  }

  private async open(file: string): Promise<void> {
    const document = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(document);
  }
}
