import * as vscode from "vscode";

export interface Item<T> extends vscode.QuickPickItem {
  value: T;
}
