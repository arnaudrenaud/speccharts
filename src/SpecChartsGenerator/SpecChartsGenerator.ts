import { GenerateArgs, File, SpecChart } from "../types";
import { Logger } from "./helpers/log";
import { getChartFromSpecFile } from "./helpers/getChartFromSpecFile";

/**
 * A generator for creating spec charts from test specification files.
 */
export class SpecChartsGenerator {
  constructor(
    private getFilePaths: (patterns: string[]) => Promise<string[]>,
    private readFile: (path: string) => Promise<File>,
    private logger: Logger = new Logger(() => {})
  ) {}

  /**
   * Generates spec charts from the given input patterns.
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
