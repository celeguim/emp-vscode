import { Application } from "../models/Application";
import { Project } from "../models/Project";

// export interface ApplicationResult {
//   application: Application;
//   project?: Project;
// }

export interface GeneratedObject<T = unknown> {
  folder: string;
  name: string;
  object: T;
}

export interface ApplicationResult {
  objects: GeneratedObject[];
}
