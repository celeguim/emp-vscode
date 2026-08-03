import * as vscode from "vscode";
import { UI } from "./UI";
import { Environment } from "../models/Environment";

export class VSCodeUI implements UI {
  async askApplicationName() {
    return vscode.window.showInputBox({
      title: "Application Name",
    });
  }

  async askRepository() {
    return vscode.window.showInputBox({
      title: "Repository URL",
    });
  }

  async askPath() {
    return vscode.window.showInputBox({
      title: "Path",
    });
  }

  async pickEnvironment(environments: Environment[]) {
    const environmentNames = environments.map((e) => e.name);
    const selectedEnvironment = await vscode.window.showQuickPick(
      environmentNames,
      {
        title: "Select Environment",
      },
    );
    return environments.find((e) => e.name === selectedEnvironment);
  }

  info(message: string) {
    vscode.window.showInformationMessage(message);
  }

  error(message: string) {
    vscode.window.showErrorMessage(message);
  }
}
