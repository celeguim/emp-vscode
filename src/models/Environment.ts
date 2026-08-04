import * as vscode from "vscode";

export interface Environment {
  name: string;
  project: string;
  cluster: string;
  repoURL: string;
  namespace: string;
  targetRevision: string;
}

interface EnvironmentQuickPickItem extends vscode.QuickPickItem {
  environment: Environment;
}
