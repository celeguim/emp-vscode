import * as vscode from "vscode";

import { FilesystemCatalog } from "./catalog/FilesystemCatalog";
import { YamlWriter } from "./writer/YamlWriter";
import { DeleteCommand } from "./commands/DeleteCommand";
import { NewCommand } from "./commands/NewCommand";
import { ApplicationGenerator } from "./generators/ApplicationGenerator";
import { ProjectGenerator } from "./generators/ProjectGenerator";

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
  const appGenerator = new ApplicationGenerator(catalog);
  const projectGenerator = new ProjectGenerator(catalog);

  const newCommand = new NewCommand(
    catalog,
    writer,
    appGenerator,
    projectGenerator,
  );
  const deleteCommand = new DeleteCommand(catalog, writer);

  context.subscriptions.push(
    vscode.commands.registerCommand("emp.new", () => newCommand.execute()),
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("emp.delete", () =>
      deleteCommand.execute(),
    ),
  );
}

export function deactivate() {}
