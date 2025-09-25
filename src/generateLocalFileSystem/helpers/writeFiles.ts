import fsExtra from "fs-extra";
import { File } from "@/types";

import { standardOutputLogger } from "./standardOutputLogger";

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
