import * as vscode from "vscode";
import { Catalog } from "./catalog/Catalog";
import { ApplicationBuilder } from "./catalog/builder/ApplicationBuilder";
import { ApplicationWriter } from "./catalog/writer/ApplicationWriter";

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

            // const environments = getEnvironments(root);

            const catalog = new Catalog(root);

            const envs = catalog.getEnvironments();

            const env = await vscode.window.showQuickPick(
                envs.map(e => e.name),
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

            const name = "app1";
            const repo = "repo1";
            const chart = "chart1";

            const app = new ApplicationBuilder()

                .name(name)

                .environment(env)

                .repoURL(repo)

                .path(chart)

                .build();

            console.log(app);

            const writer = new ApplicationWriter();

            const content = writer.write(app);



        }
    );

    context.subscriptions.push(disposable);
}

export function deactivate() { }
