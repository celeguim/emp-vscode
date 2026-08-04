import { Catalog } from "../catalog/Catalog";
import { ApplicationGenerator } from "../generators/ApplicationGenerator";
import { YamlWriter } from "../writer/YamlWriter";
import * as vscode from "vscode";

export class NewCommand {
  constructor(
    private readonly catalog: Catalog,
    private readonly writer: YamlWriter,
    private readonly applicationGenerator: ApplicationGenerator,
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

      default:
        vscode.window.showInformationMessage("Coming soon...");
    }
  }

  private async newApplication() {
    const name = await vscode.window.showInputBox({
      title: "Application Name",
    });

    if (!name) {
      return;
    }

    const environments = this.catalog.getEnvironments();

    const env = await vscode.window.showQuickPick(
      environments.map((env) => ({
        label: env.name,
        description: env.project,
        detail: env.cluster,
        environment: env, // guarda o objeto inteiro
      })),
      {
        title: "Environment",
      },
    );

    if (!env) {
      return;
    }

    const environment = env.environment;
    const result = this.applicationGenerator.create({
      name: name,
      environment: environment,
    });

    for (const object of result.objects) {
      this.writer.save(object.folder, object.name, object.object);
    }

    vscode.window.showInformationMessage(`Application '${name}' created.`);
  }
}
