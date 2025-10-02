import { glob } from "fast-glob";
import { getCurrentDirectory } from "./getCurrentDirectory";

export const getFilePaths = async (patterns: string[]): Promise<string[]> => {
  return glob(patterns, {
    cwd: getCurrentDirectory(),
    absolute: true,
  });
};
