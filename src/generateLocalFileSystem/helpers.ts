import { glob } from "fast-glob";
import fsExtra from "fs-extra";
import { Logger } from "../Generate/helpers/log";
import { File } from "../Generate/types";

export const getFilePaths = async (patterns: string[]): Promise<string[]> => {
  return glob(patterns);
};

export const readFile = async (path: string): Promise<File> => {
  return { path, content: (await fsExtra.readFile(path)).toString() };
};

export const standardOutputLogger = new Logger(console.log);

export const writeToLocalFileSystem = async (
  files: File[]
): Promise<File[]> => {
  const logger = new Logger(console.log);
  const filesWritten = await Promise.all(
    files.map(async (file) => {
      await fsExtra.outputFile(file.path, file.content);
      return file;
    })
  );
  logger.logChartFilesWritten(filesWritten);
  return filesWritten;
};
