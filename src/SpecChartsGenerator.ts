export type Config = {
  specFilePatterns: string[];
  // and more…
};

type FileWithContent = {
  name: string;
  content: string;
};

type SpecEntity = {};

type ChartFromSpec = {
  specFile: FileWithContent;
  chart: string;
};

export class SpecChartsGenerator {
  constructor(
    private config: Config,
    private getFileNames: (patterns: string[]) => Promise<string[]>,
    private readFile: (name: string) => Promise<FileWithContent>,
    private writeFile: (file: FileWithContent) => Promise<void>
  ) {}

  getSpecTree(fileContent: string): SpecEntity {
    // TODO
    return {};
  }

  getChart(specParts: SpecEntity): string {
    // TODO
    return "";
  }

  getChartFromSpecFile(specFile: FileWithContent): ChartFromSpec {
    // TODO
    return {
      specFile,
      chart: this.getChart(this.getSpecTree(specFile.content)),
    };
  }

  getChartFiles(charts: ChartFromSpec[]): FileWithContent[] {
    // TODO
    // can be either an array:
    // - with one chart per file,
    // - or a single file with all charts
    return [];
  }

  async generate() {
    const specFileNames = await this.getFileNames(this.config.specFilePatterns);
    const specFiles = await Promise.all(specFileNames.map(this.readFile));
    const chartsForSpecFiles = specFiles.map(this.getChartFromSpecFile);
    const filesToWrite = this.getChartFiles(chartsForSpecFiles);
    await Promise.all(filesToWrite.map(this.writeFile));
  }
}
