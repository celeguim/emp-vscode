import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { getEnvironments } from "./catalog";

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand(
        "emp.newApplication",
        async () => {

            const editor = vscode.window.activeTextEditor;

            if (!editor) {
                vscode.window.showErrorMessage("Open a file first.");
                return;
            }

            const folder = vscode.workspace.getWorkspaceFolder(
                editor.document.uri
            );

            if (!folder) {
                vscode.window.showErrorMessage("File is not inside a workspace.");
                return;
            }

            const root = folder.uri.fsPath;

            vscode.window.showInformationMessage(root);

            const environments = getEnvironments(root);

            const env = await vscode.window.showQuickPick(
                environments,
                {
                    title: "Environment",
                    placeHolder: "Choose an environment"
                }
            );

            if (!env) {
                return;
            }

            vscode.window.showInformationMessage(
                `Environment selected: ${env}`
            );

        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() { }
