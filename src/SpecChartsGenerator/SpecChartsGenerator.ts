import { GenerateArgs, File, SpecChart } from "../types";
import { Logger } from "./helpers/log";
import { getChartFromSpecFile } from "./helpers/getChartFromSpecFile";
import { getFilePaths as getFilePathsFromLocalFileSystem } from "../generateLocalFileSystem/helpers/getFilePaths";
import { readFile as readFileFromLocalFileSystem } from "../generateLocalFileSystem/helpers/readFile";

export class SpecChartsGenerator {
  constructor(
    private getFilePaths: (
      patterns: string[]
    ) => Promise<string[]> = getFilePathsFromLocalFileSystem,
    private readFile: (
      path: string
    ) => Promise<File> = readFileFromLocalFileSystem,
    private logger: Logger = new Logger(() => {})
  ) {}

  /**
   * Return Mermaid spec charts generated from spec files matching input patterns.
   */
  async generate(args: GenerateArgs): Promise<SpecChart[]> {
    const specFilePaths = await this.getFilePaths(args.inputFilePatterns);
    if (specFilePaths.length === 0) {
      throw new Error(
        `❌ Found no spec files – did you pass directory name instead of glob pattern (e.g. "src" instead of "src/**/*.spec.ts")?`
      );
    }
    this.logger.logSpecFilesFound(specFilePaths);

    const specFiles = await Promise.all(specFilePaths.map(this.readFile));

    return specFiles.map(getChartFromSpecFile);
  }
}
