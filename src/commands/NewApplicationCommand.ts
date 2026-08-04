import * as vscode from "vscode";
import { Catalog } from "../catalog/Catalog";
import { YamlWriter } from "../writer/YamlWriter";
import { ApplicationGenerator } from "../generators/ApplicationGenerator";

export class NewApplicationCommand {
  constructor(
    private readonly catalog: Catalog,
    private readonly writer: YamlWriter,
  ) {}

  async execute(): Promise<void> {
    console.log("1 - asking name");
    const name = await vscode.window.showInputBox({
      title: "Application Name",
    });
    console.log("2 - name =", name);

    if (!name) {
      return;
    }

    const env = await vscode.window.showQuickPick(
      this.catalog.getEnvironments().map((e) => ({
        label: e.name,
      })),
      {
        title: "Environment",
      },
    );
    console.log("3 - env =", env);

    if (!env) {
      return;
    }

    // const environment = this.catalog
    //   .getEnvironments()
    //   .find((e) => e.name === env.label)!;
    // const result = ApplicationGenerator.create(name, environment);

    const app = {
      name,
      environment: env,
      repoURL: "https://github.com/celeguim/gitops.git",
      path: `charts/${name}`,
    };
    console.log("4 - app =", app);

    this.writer.writeApplication(app);
    console.log("5 - written");

    vscode.window.showInformationMessage(`${name}.yaml created`);
  }
}
