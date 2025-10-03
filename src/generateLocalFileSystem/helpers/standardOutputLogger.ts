import { Logger } from "../../SpecChartsGenerator/helpers/log";
import { getCurrentDirectory } from "./getCurrentDirectory";

export const standardOutputLogger = new Logger(
  console.log,
  getCurrentDirectory()
);
