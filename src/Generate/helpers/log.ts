import { File } from "../types";

export function logTestFilesFound(testFilePaths: string[]) {
  console.log(
    `🔎 Found ${testFilePaths.length} test files:\n${testFilePaths.join(
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
