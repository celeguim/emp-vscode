import * as fs from "fs";
import * as path from "path";

export function getEnvironments(root: string): string[] {

    const envDir = path.join(root, "catalog", "environments");

    if (!fs.existsSync(envDir)) {
        return [];
    }

    return fs.readdirSync(envDir)
        .filter(f => f.endsWith(".yaml"))
        .map(f => path.basename(f, ".yaml"))
        .sort();
}
