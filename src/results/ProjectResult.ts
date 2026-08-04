// import { Application } from "../models/Application";
// import { Project } from "../models/Project";

export interface GeneratedObject<T = unknown> {
  folder: string;
  name: string;
  object: T;
}

export interface ProjectResult {
  objects: GeneratedObject[];
}
