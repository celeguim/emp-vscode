import * as vscode from "vscode";

import { FilesystemCatalog } from "./catalog/FilesystemCatalog";
import { YamlWriter } from "./writer/YamlWriter";
import { NewApplicationCommand } from "./commands/NewApplicationCommand";
import { NewProjectCommand } from "./commands/NewProjectCommand";
import { DeleteCommand } from "./commands/DeleteCommand";

export function activate(context: vscode.ExtensionContext) {
  // Descobre a raiz do workspace
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    vscode.window.showErrorMessage("Open a workspace first.");
    return;
  }

  const root = workspace.uri.fsPath;

  // Infraestrutura
  const catalog = new FilesystemCatalog(root);
  const writer = new YamlWriter(root);

  // Commands
  const newApplication = new NewApplicationCommand(catalog, writer);
  const newProject = new NewProjectCommand(catalog, writer);
  const deleteCommand = new DeleteCommand(catalog, writer);

  context.subscriptions.push(
    vscode.commands.registerCommand("emp.newApplication", () =>
      newApplication.execute(),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("emp.newProject", () =>
      newProject.execute(),
    ),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("emp.delete", () =>
      deleteCommand.execute(),
    ),
  );
}

export function deactivate() {}
