import { glob } from "fast-glob";

export const getFilePaths = async (patterns: string[]): Promise<string[]> => {
  return glob(patterns);
};
