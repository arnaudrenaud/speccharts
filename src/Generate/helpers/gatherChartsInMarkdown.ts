import { SpecChart } from "../types";
import packageJson from "../../../package.json";
import { GENERATED_BY_SPECCHARTS_LABEL } from "./constants";

export function gatherChartsInMarkdown(charts: SpecChart[]): string {
  return `# speccharts

${charts
  .map(({ chart }) => `\`\`\`mermaid\n${chart}\n\`\`\``)
  .join("\n\n---\n\n")}

<!-- ${GENERATED_BY_SPECCHARTS_LABEL} -->
`;
}
