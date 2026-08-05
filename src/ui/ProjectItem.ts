import * as vscode from "vscode";
import { Project } from "../models/Project";

export interface ProjectItem extends vscode.QuickPickItem {
  project: Project;
}
