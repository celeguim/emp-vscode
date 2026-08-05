import { Catalog } from "../catalog/Catalog";
import { ApplicationGenerator } from "../generators/ApplicationGenerator";
import { ClusterGenerator } from "../generators/ClusterGenerator";
import { ProjectGenerator } from "../generators/ProjectGenerator";
import { Environment } from "../models/Environment";
import { ApplicationRequest } from "../requests/ApplicationRequest";
import { ClusterRequest } from "../requests/ClusterRequest";
import { ApplicationResult } from "../results/ApplicationResult";
import { item } from "../ui/Items";
import { VSCodeUI } from "../ui/VSCodeUI";
import { YamlWriter } from "../writer/YamlWriter";
import * as vscode from "vscode";

export class NewCommand {
  constructor(
    private readonly catalog: Catalog,
    private readonly writer: YamlWriter,
    private readonly applicationGenerator: ApplicationGenerator,
    private readonly projectGenerator: ProjectGenerator,
    private readonly clusterGenerator: ClusterGenerator,
  ) {}

  async execute() {
    const type = await vscode.window.showQuickPick(
      ["Application", "Project", "Environment", "Cluster"],
      {
        title: "What do you want to create?",
      },
    );

    switch (type) {
      case "Application":
        await this.newApplication();
        break;

      case "Project":
        await this.newProject();
        break;

      case "Cluster":
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

    const result = this.applicationGenerator.create(request);

    this.save(result);

    vscode.window.showInformationMessage(
      `Application '${request.name}' created.`,
    );
  }

  private async buildApplicationRequest(): Promise<
    ApplicationRequest | undefined
  > {
    const name = await this.askName("Application");

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
    const selected = await vscode.window.showQuickPick(
      this.catalog
        .getEnvironments()
        .map((env) => item(env.name, env, env.project, env.cluster)),
      {
        title: "Environment",
        ignoreFocusOut: true,
      },
    );

    return selected?.value;
  }

  private save(result: ApplicationResult): void {
    for (const object of result.objects) {
      this.writer.save(object.folder, object.name, object.object);
    }
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
    console.log("2 - desc =", desc);

    const description: string = desc ?? "";

    const result = this.projectGenerator.create({
      name: name,
      description: description,
    });

    for (const object of result.objects) {
      this.writer.save(object.folder, object.name, object.object);
    }

    vscode.window.showInformationMessage(`${name}.yaml created`);
  }

  private async newCluster() {
    const request = await this.buildClusterRequest();

    if (!request) {
      return;
    }

    const result = this.clusterGenerator.create({
      name: request.name,
      server: request.server,
    });

    for (const object of result.objects) {
      this.writer.save(object.folder, object.name, object.object);
    }

    vscode.window.showInformationMessage(`${request.name}.yaml created`);
  }

  private async buildClusterRequest(): Promise<ClusterRequest | undefined> {
    const name = await this.askName("Cluster");

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
