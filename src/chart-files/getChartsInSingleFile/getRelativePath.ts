import path from "path";
import { File } from "../../types";

export function getRelativePath(
  outputDirectoryPath: string,
  specFile: File
): string {
  return path.relative(outputDirectoryPath, specFile.path);
}
