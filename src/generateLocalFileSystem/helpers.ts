import { glob } from "fast-glob";
import fsExtra from "fs-extra";
import { File } from "../Generate/types";
import { standardOutputLogger } from "./standardOutputLogger";

export const getFilePaths = async (patterns: string[]): Promise<string[]> => {
  return glob(patterns);
};

export const readFile = async (path: string): Promise<File> => {
  return { path, content: (await fsExtra.readFile(path)).toString() };
};

export const writeToLocalFileSystem = async (
  files: File[]
): Promise<File[]> => {
  const logger = standardOutputLogger;
  const filesWritten = await Promise.all(
    files.map(async (file) => {
      await fsExtra.outputFile(file.path, file.content);
      return file;
    })
  );
  logger.logChartFilesWritten(filesWritten);
  return filesWritten;
};
