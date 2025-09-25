import { GENERATED_BY_SPECCHARTS_LABEL } from "./constants";

export function getChartFileContent(chart: string): string {
  return `${chart}

%% ${GENERATED_BY_SPECCHARTS_LABEL}
`;
}
