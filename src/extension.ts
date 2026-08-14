import * as vscode from "vscode";
import { FilesystemCatalog } from "./catalog/FilesystemCatalog";
import { YamlWriter } from "./writer/YamlWriter";
import { NewCommand } from "./commands/NewCommand";

export function activate(context: vscode.ExtensionContext) {
  const workspace = vscode.workspace.workspaceFolders?.[0];

  if (!workspace) {
    vscode.window.showErrorMessage("Open a workspace first.");
    return;
  }

  const root = workspace.uri.fsPath;

  const catalog = new FilesystemCatalog(root);
  const writer = new YamlWriter(root);

  const newCommand = new NewCommand(catalog, writer);

  context.subscriptions.push(
    vscode.commands.registerCommand("emp.new", () => newCommand.execute()),
  );
}

export function deactivate() {}
