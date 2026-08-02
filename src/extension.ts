import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const disposable = vscode.commands.registerCommand(
        'emp.newApplication',
        async () => {

            vscode.window.showInformationMessage(
                'Hello EMP!'
            );

        });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
