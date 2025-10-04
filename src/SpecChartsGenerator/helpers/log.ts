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

  private getDisplayPath = (absolutePath: string): string => {
    const relativePath = path.relative(this.workingDirectory, absolutePath);

    if (relativePath.includes("\\")) {
      // Windows paths can have double backslashes, replace with single
      return relativePath.replace(/\\\\/g, "\\");
    }
    return relativePath; // Unix paths have forward slashes
  };

  logSpecFilesFound(specFilePaths: string[]) {
    const displayPaths = specFilePaths.map(this.getDisplayPath);

    this.log(
      `🔎 Found ${pluralize(
        "spec file",
        specFilePaths.length
      )}:\n${displayPaths.join("\n")}\n`
    );
  }

  logChartFilesWritten(filesWritten: File[]): void {
    const displayPaths = filesWritten.map(({ path }) =>
      this.getDisplayPath(path)
    );

    this.log(
      `✏️ Wrote ${pluralize(
        "chart file",
        filesWritten.length
      )}:\n${displayPaths.join("\n")}`
    );
  }

  logChartFilesRemoved(paths: string[]): void {
    if (paths.length === 0) {
      return;
    }

    const displayPaths = paths.map(this.getDisplayPath);

    this.log(
      `🧹 Deleted ${pluralize(
        "existing chart file",
        paths.length
      )}:\n${displayPaths.join("\n")}\n`
    );
  }
}
