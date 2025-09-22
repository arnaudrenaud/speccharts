import { File } from "../types";

function pluralize(word: string, count: number): string {
  return `${count} ${word}${count === 1 ? "" : "s"}`;
}

export function logSpecFilesFound(specFilePaths: string[]) {
  console.log(
    `🔎 Found ${pluralize(
      "spec file",
      specFilePaths.length
    )}:\n${specFilePaths.join("\n")}\n`
  );
}

export function logChartFilesWritten(filesWritten: File[]): void {
  console.log(
    `✏️ Wrote ${pluralize("chart file", filesWritten.length)}:\n${filesWritten
      .map((file) => file.path)
      .join("\n")}`
  );
}
