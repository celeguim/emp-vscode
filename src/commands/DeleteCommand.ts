import { Catalog } from "../catalog/Catalog";
import { YamlWriter } from "../writer/YamlWriter";
import * as vscode from "vscode";

export class DeleteCommand {
  constructor(
    private readonly catalog: Catalog,
    private readonly writer: YamlWriter,
  ) {}

  async execute() {
    const type = await vscode.window.showQuickPick(
      ["Application", "Project", "Environment", "Cluster"],
      {
        title: "What do you want to delete?",
      },
    );

    switch (type) {
      case "Application":
        await this.deleteApplication();
        break;

      case "Project":
        await this.deleteProject();
        break;

      case "Cluster":
        await this.deleteCluster();
        break;

      case "Environment":
        await this.deleteEnvironment();
        break;
    }
  }

  private async deleteEnvironment() {
    const env = await vscode.window.showQuickPick(
      this.catalog.getEnvironments().map((e) => e.name),
      {
        title: "Environment",
      },
    );

    if (!env) {
      return;
    }

    const confirm = await vscode.window.showWarningMessage(
      `Delete '${env}'?`,
      {
        modal: true,
      },

      "Delete",
    );

    if (confirm !== "Delete") {
      return;
    }

    this.writer.delete("environments", env);
    vscode.window.showInformationMessage(`${env} deleted`);
  }

  private async deleteApplication() {
    const app = await vscode.window.showQuickPick(
      this.catalog.getApplications().map((a) => a.name),
      {
        title: "Application",
      },
    );

    if (!app) {
      return;
    }

    const confirm = await vscode.window.showWarningMessage(
      `Delete '${app}'?`,
      {
        modal: true,
      },

      "Delete",
    );

    if (confirm !== "Delete") {
      return;
    }

    this.writer.delete("applications", app);
    vscode.window.showInformationMessage(`${app} deleted`);
  }

  private async deleteProject() {
    const project = await vscode.window.showQuickPick(
      this.catalog.getProjects().map((p) => p.name),
      {
        title: "Project",
      },
    );

    if (!project) {
      return;
    }

    const confirm = await vscode.window.showWarningMessage(
      `Delete '${project}'?`,
      {
        modal: true,
      },

      "Delete",
    );

    if (confirm !== "Delete") {
      return;
    }

    this.writer.delete("projects", project);
    vscode.window.showInformationMessage(`${project} deleted`);
  }

  private async deleteCluster() {
    const clusters = this.catalog.getClusters();

    const cluster = await vscode.window.showQuickPick(
      this.catalog.getClusters().map((c) => c.name),
      {
        title: "Cluster",
      },
    );

    if (!cluster) {
      return;
    }

    const confirm = await vscode.window.showWarningMessage(
      `Delete '${cluster}'?`,
      {
        modal: true,
      },

      "Delete",
    );

    if (confirm !== "Delete") {
      return;
    }

    this.writer.delete("clusters", cluster);
    vscode.window.showInformationMessage(`${cluster} deleted`);
  }
}
