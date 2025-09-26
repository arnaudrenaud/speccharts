import { File } from "../../types";

function pluralize(word: string, count: number): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export class Logger {
  constructor(public log: (message: string) => void) {}

  logSpecFilesFound(specFilePaths: string[]) {
    this.log(
      `🔎 Found ${pluralize(
        "spec file",
        specFilePaths.length
      )}:\n${specFilePaths.join("\n")}\n`
    );
  }

  logChartFilesWritten(filesWritten: File[]): void {
    this.log(
      `✏️ Wrote ${pluralize("chart file", filesWritten.length)}:\n${filesWritten
        .map((file) => file.path)
        .join("\n")}`
    );
  }

  logChartFilesRemoved(paths: string[]): void {
    if (paths.length === 0) {
      return;
    }

    this.log(
      `🧹 Deleted ${pluralize(
        "existing chart file",
        paths.length
      )}:\n${paths.join("\n")}\n`
    );
  }
}
