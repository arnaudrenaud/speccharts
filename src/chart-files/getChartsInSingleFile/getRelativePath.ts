import path from "path";
import { File } from "../../types";

export function getForwardSlashRelativePath(
  outputDirectoryPath: string,
  specFile: File
): string {
  return path.relative(outputDirectoryPath, specFile.path).replace(/\\/g, "/");
}
