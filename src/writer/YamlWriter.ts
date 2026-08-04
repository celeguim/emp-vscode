import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";

export class YamlWriter {
  constructor(private readonly root: string) {}

  writeApplication(app: any) {
    const dir = path.join(this.root, "catalog", "applications");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${app.name}.yaml`);
    fs.writeFileSync(file, YAML.stringify(app), "utf8");
  }

  writeProject(project: any) {
    const dir = path.join(this.root, "catalog", "projects");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${project.name}.yaml`);
    fs.writeFileSync(file, YAML.stringify(project), "utf8");
  }

  delete(folder: string, name: string) {
    const file = path.join(this.root, "catalog", folder, `${name}.yaml`);

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}
