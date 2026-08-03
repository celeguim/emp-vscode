import * as yaml from "yaml";
import { Application } from "../models/Application";

export class ApplicationWriter {

    write(app: Application): string {

        return yaml.stringify(app);

    }

}
