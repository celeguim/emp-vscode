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

type SelectItem<T> = vscode.QuickPickItem & {
  value: T;
};

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
      case ResourceKind.Project:
        await this.newProject();
        break;

      case ResourceKind.Application:
        await this.newApplication();
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

    const existing = this.catalog
      .getEnvironments()
      .find((environment) => environment.name === name);

    const project = await this.askProject(existing?.project);

    if (!project) {
      return;
    }

    const cluster = await this.askCluster(existing?.cluster);

    if (!cluster) {
      return;
    }

    const namespace = await this.askNamespace(existing?.namespace);

    if (!namespace) {
      return;
    }

    const targetRevision = await this.askTargetRevision(
      existing?.targetRevision,
    );

    if (!targetRevision) {
      return;
    }

    const syncPolicy = await this.askSyncPolicy(existing?.syncPolicy);

    if (!syncPolicy) {
      return;
    }

    const environment: Environment = {
      name,
      project: project.name,
      cluster: cluster.name,
      namespace,
      targetRevision,
      syncPolicy,
    };

    const file = this.writer.save(
      "environments",
      environment.name,
      environment,
    );

    await this.open(file);

    vscode.window.showInformationMessage(`Environment '${name}' created.`);
  }

  private async newApplication(): Promise<void> {
    const request = await this.buildApplicationRequest();

    if (!request) {
      return;
    }

    const app: Application = {
      name: request.name,
      environment: request.environment.name,
      repoURL: request.repoUrl,
      path: `charts/${request.name}`,
      project: request.environment.project,
    };

    const file = this.writer.save("applications", app.name, app);
    // const doc = await vscode.workspace.openTextDocument(file);
    // await vscode.window.showTextDocument(doc);
    await this.open(file);

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

    const curApp = this.catalog
      .getApplications()
      .find((app) => app.name === name);

    const environment = await this.askEnvironment(curApp?.environment);

    if (!environment) {
      return;
    }

    const repoUrl = await this.askRepository(curApp?.repoURL);

    if (!repoUrl) {
      return;
    }

    return {
      name,
      environment,
      repoUrl,
    };
  }

  private async askName(item: string): Promise<string | undefined> {
    return vscode.window.showInputBox({
      title: `${item} Name`,
      prompt: `Enter ${item} name`,
      ignoreFocusOut: true,
    });
  }

  private async askEnvironment(
    current?: string,
  ): Promise<Environment | undefined> {
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
      detail: `${e.namespace} (${e.targetRevision})`,
      environment: e,
      value: e,
    }));

    const quickPick = vscode.window.createQuickPick<(typeof items)[number]>();

    quickPick.title = "Environment";
    quickPick.placeholder = "Select Environment";
    quickPick.items = items;

    const activeItem = items.find((item) => item.environment.name === current);

    if (activeItem) {
      quickPick.activeItems = [activeItem];
    }

    return new Promise((resolve) => {
      quickPick.onDidAccept(() => {
        resolve(quickPick.selectedItems[0]?.environment);
        quickPick.hide();
      });

      quickPick.onDidHide(() => {
        resolve(undefined);
        quickPick.dispose();
      });

      quickPick.show();
    });
  }

  private async newProject() {
    const name = await this.askName(ResourceKind.Project);
    if (!name) {
      return;
    }

    const items = this.catalog.getProjects();
    const activeItem = items.find((item) => item.name === name);

    const desc = await vscode.window.showInputBox({
      title: "Project Description",
      value: activeItem?.description ?? "",
    });

    if (desc === undefined) {
      return;
    }

    const project: Project = {
      name: name,
      description: desc,
    };

    const file = this.writer.save("projects", project.name, project);
    this.open(file);
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
    this.open(file);
    vscode.window.showInformationMessage(`${request.name}.yaml created`);
  }

  private async buildClusterRequest(): Promise<ClusterRequest | undefined> {
    const name = await this.askName(ResourceKind.Cluster);

    if (!name) {
      return;
    }

    const server = await this.askServer(name);

    if (server === undefined) {
      return;
    }

    return {
      name,
      server,
    };
  }

  private async askServer(cluster?: string): Promise<string | undefined> {
    const clusters = this.catalog.getClusters();
    const current = clusters.find((item) => item.name === cluster);

    return vscode.window.showInputBox({
      title: "Cluster URL",
      prompt: "https://kubernetes.default.svc",
      ignoreFocusOut: true,
      value: current?.server ?? "",
    });
  }

  private async askProject(current?: string): Promise<Project | undefined> {
    const projects = this.catalog.getProjects();

    if (projects.length === 0) {
      vscode.window.showWarningMessage(
        "No projects found. Create a Project first.",
      );
      return;
    }

    const items: SelectItem<Project>[] = projects.map((project) => ({
      label: project.name,
      description: project.description,
      value: project,
    }));

    const quickPick = vscode.window.createQuickPick<(typeof items)[number]>();

    quickPick.title = "Project";
    quickPick.placeholder = "Select Project";
    quickPick.items = items;

    const activeItem = items.find((item) => item.value.name === current);

    if (activeItem) {
      quickPick.activeItems = [activeItem];
    }

    return new Promise((resolve) => {
      quickPick.onDidAccept(() => {
        resolve(quickPick.selectedItems[0]?.value);
        quickPick.hide();
      });

      quickPick.onDidHide(() => {
        resolve(undefined);
        quickPick.dispose();
      });

      quickPick.show();
    });
  }

  private async askCluster(current?: string): Promise<Cluster | undefined> {
    const clusters = this.catalog.getClusters();

    if (clusters.length === 0) {
      vscode.window.showWarningMessage(
        "No clusters found. Create a Cluster first.",
      );
      return;
    }

    const items: SelectItem<Cluster>[] = clusters.map((cluster) => ({
      label: cluster.name,
      description: cluster.server,
      value: cluster,
    }));

    const quickPick = vscode.window.createQuickPick<(typeof items)[number]>();

    quickPick.title = "Cluster";
    quickPick.placeholder = "Select Cluster";
    quickPick.items = items;

    const activeItem = items.find((item) => item.value.name === current);

    if (activeItem) {
      quickPick.activeItems = [activeItem];
    }

    return new Promise((resolve) => {
      quickPick.onDidAccept(() => {
        resolve(quickPick.selectedItems[0]?.value);
        quickPick.hide();
      });

      quickPick.onDidHide(() => {
        resolve(undefined);
        quickPick.dispose();
      });

      quickPick.show();
    });
  }

  private async askRepository(current?: string): Promise<string | undefined> {
    return vscode.window.showInputBox({
      title: "Repository URL",
      placeHolder: "https://github.com/celeguim/gitops.git",
      ignoreFocusOut: true,
      value: current ?? "https://github.com/celeguim/gitops.git",
    });
  }

  private async askTargetRevision(
    current?: string,
  ): Promise<string | undefined> {
    return vscode.window.showInputBox({
      title: "Target Revision",
      value: current ?? "HEAD",
    });
  }

  private async open(file: string): Promise<void> {
    const document = await vscode.workspace.openTextDocument(file);
    await vscode.window.showTextDocument(document);
  }

  private async askSyncPolicy(current?: string): Promise<string | undefined> {
    const items = [
      {
        label: "Enabled",
        value: "enabled",
      },
      {
        label: "Disabled",
        value: "disabled",
      },
    ];

    const quickPick = vscode.window.createQuickPick<(typeof items)[number]>();

    quickPick.title = "Sync Policy";
    quickPick.placeholder = "Select sync policy";
    quickPick.items = items;

    const activeItem = items.find((item) => item.value === current);

    if (activeItem) {
      quickPick.activeItems = [activeItem];
    }

    return new Promise((resolve) => {
      quickPick.onDidAccept(() => {
        resolve(quickPick.selectedItems[0]?.value);
        quickPick.hide();
      });

      quickPick.onDidHide(() => {
        resolve(undefined);
        quickPick.dispose();
      });

      quickPick.show();
    });
  }

  private async askNamespace(current?: string): Promise<string | undefined> {
    return vscode.window.showInputBox({
      title: "Namespace",
      value: current,
    });
  }
}
