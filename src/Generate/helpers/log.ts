import { File } from "../types";

export function logSpecFilesFound(specFilePaths: string[]) {
  console.log(
    `🔎 Found ${specFilePaths.length} spec files:\n${specFilePaths.join(
      "\n"
    )}\n`
  );
}

export function logChartFilesWritten(filesWritten: File[]): void {
  console.log(
    `✏️ Wrote ${filesWritten.length} chart files:\n${filesWritten
      .map((file) => file.path)
      .join("\n")}`
  );
}
