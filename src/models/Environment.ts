import * as vscode from "vscode";

export interface Environment {
  name: string;
  project: string;
  cluster: string;
  repoURL: string;
  targetRevision: string;
  namespace?: string;
  file?: string;
}
