import { spawn } from "child_process";
import path from "path";

const ROOT_DIR = path.resolve(__dirname, "../../..");
const CLI_ENTRY_PATH = path.resolve(ROOT_DIR, "dist/cli/index.js");

export function runCli(args: string[]): Promise<{
  stdout: string;
  stderr: string;
  exitCode: number;
}> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [CLI_ENTRY_PATH, ...args], {
      cwd: ROOT_DIR,
      env: { ...process.env },
    });

    let stdout = "";
    let stderr = "";

    child.stdout?.setEncoding("utf8");
    child.stdout?.on("data", (data: Buffer | string) => {
      stdout += data.toString();
    });

    child.stderr?.setEncoding("utf8");
    child.stderr?.on("data", (data: Buffer | string) => {
      stderr += data.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code ?? 0,
      });
    });
  });
}
