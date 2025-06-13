import { Config, FileWithContent, SpecTree, SpecChart } from "./types";

export class SpecChartsGenerator {
  constructor(
    private config: Config,
    private getFilePaths: (patterns: string[]) => Promise<string[]>,
    private readFile: (path: string) => Promise<FileWithContent>,
    private writeFile: (file: FileWithContent) => Promise<void>
  ) {}

  getSpecTree(file: FileWithContent): SpecTree {
    // TODO
    return {
      name: file.path,
      children: [],
    };
  }

  getChart(specTree: SpecTree): string {
    return "";
  }

  getChartFromSpecFile(specFile: FileWithContent): SpecChart {
    return {
      specFile,
      chart: this.getChart(this.getSpecTree(specFile)),
    };
  }

  getChartFiles(charts: SpecChart[]): FileWithContent[] {
    // TODO
    // can be either an array:
    // - with one chart per file,
    // - or a single file with all charts
    return [];
  }

  async generate() {
    const specFilePaths = await this.getFilePaths(this.config.specFilePatterns);
    const specFiles = await Promise.all(specFilePaths.map(this.readFile));
    const charts = specFiles.map(this.getChartFromSpecFile);
    const filesToWrite = this.getChartFiles(charts);
    await Promise.all(filesToWrite.map(this.writeFile));
  }
}
