import path from "path";
import { File } from "../../types";

function pluralize(word: string, count: number): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export class Logger {
  constructor(
    public log: (message: string) => void,
    private workingDirectory: string = process.cwd()
  ) {}

  private getRelativePath = (absolutePath: string): string => {
    return path.relative(this.workingDirectory, absolutePath);
  };

  logSpecFilesFound(specFilePaths: string[]) {
    const relativePaths = specFilePaths.map(this.getRelativePath);

    this.log(
      `🔎 Found ${pluralize(
        "spec file",
        specFilePaths.length
      )}:\n${relativePaths.join("\n")}\n`
    );
  }

  logChartFilesWritten(filesWritten: File[]): void {
    const relativePaths = filesWritten.map(({ path }) =>
      this.getRelativePath(path)
    );

    this.log(
      `✏️ Wrote ${pluralize(
        "chart file",
        filesWritten.length
      )}:\n${relativePaths.join("\n")}`
    );
  }

  logChartFilesRemoved(paths: string[]): void {
    if (paths.length === 0) {
      return;
    }

    const relativePaths = paths.map(this.getRelativePath);

    this.log(
      `🧹 Deleted ${pluralize(
        "existing chart file",
        paths.length
      )}:\n${relativePaths.join("\n")}\n`
    );
  }
}
