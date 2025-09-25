import fsExtra from "fs-extra";
import { File } from "@/types";

export const readFile = async (path: string): Promise<File> => {
  return { path, content: (await fsExtra.readFile(path)).toString() };
};
