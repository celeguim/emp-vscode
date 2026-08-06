import * as fs from "fs";
import * as path from "path";
import * as YAML from "yaml";

export class YamlWriter {
  constructor(private readonly root: string) {}

  save(folder: string, name: string, object: unknown): string {
    const dir = path.join(this.root, "catalog", folder);
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${name}.yaml`);
    fs.writeFileSync(file, YAML.stringify(object), "utf8");
    return file;
  }

  delete(folder: string, name: string) {
    const file = path.join(this.root, "catalog", folder, `${name}.yaml`);

    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
}
