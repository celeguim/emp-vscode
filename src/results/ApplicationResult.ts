import { Application } from "../models/Application";
import { Project } from "../models/Project";

export interface ApplicationResult {
  application: Application;
  project?: Project;
}
