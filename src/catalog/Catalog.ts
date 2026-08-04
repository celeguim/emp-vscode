import { Environment } from "../models/Environment";
import { Project } from "../models/Project";
import { Cluster } from "cluster";
import { Application } from "../models/Application";

export interface Catalog {
  getRoot(): string;
  getEnvironments(): Environment[];
  getApplications(): Application[];

  getProjects(): Project[];
  // getClusters(): Cluster[];
}
