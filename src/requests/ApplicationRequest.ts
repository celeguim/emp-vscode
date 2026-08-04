import { Environment } from "../models/Environment";

export interface ApplicationRequest {
  name: string;
  environment: Environment;
}
