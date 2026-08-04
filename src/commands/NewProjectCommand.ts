import { Catalog } from "../catalog/Catalog";
import { YamlWriter } from "../writer/YamlWriter";
import * as vscode from "vscode";

export class NewProjectCommand {
  constructor(
    private readonly catalog: Catalog,
    private readonly writer: YamlWriter,
  ) {}

  async execute(): Promise<void> {
    console.log("executing new project");

    console.log("1 - asking name");
    const name = await vscode.window.showInputBox({
      title: "Project Name",
    });
    console.log("2 - name =", name);

    console.log("1 - asking description");
    const desc = await vscode.window.showInputBox({
      title: "Project Description",
    });
    console.log("2 - desc =", desc);

    const project = {
      name: name,
      description: desc,
    };
    this.writer.writeProject(project);
    console.log("5 - written");

    vscode.window.showInformationMessage(`${name}.yaml created`);
  }
}
