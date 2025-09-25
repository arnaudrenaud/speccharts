import packageJson from "@/../package.json";
import { args as _args } from "./args";

function getTextWithColorTags(text: string, color: "blue" | "green" = "blue") {
  return `\x1b[3${color === "blue" ? "6" : "2"}m${text}\x1b[0m`;
}

function getPaddedLine(
  textWidth: number
): (value: string, index: number, array: string[]) => string {
  return (line) =>
    `┃ ${line}${" ".repeat(
      Math.max(0, textWidth - getStringWithoutInvisibleCharacters(line).length)
    )} ┃`;
}

function getStringWithoutInvisibleCharacters(line: string) {
  return line.replace(/\x1b\[[0-9;]*m/g, "");
}

export function printCommandHeader(args: typeof _args) {
  const text = `${getTextWithColorTags(
    `${packageJson.name} v${packageJson.version}`,
    "green"
  )}

· Input file patterns: ${getTextWithColorTags(
    args.inputFilePatterns.length > 1
      ? `\n    ${args.inputFilePatterns.join("\n    ")}`
      : args.inputFilePatterns[0]
  )}
· Output: ${getTextWithColorTags(
    args.singleOutputFile
      ? "single Markdown file with all charts"
      : "one Mermaid file for each chart"
  )}`;

  const textWidth = Math.max(
    ...text
      .split("\n")
      .map((line) => getStringWithoutInvisibleCharacters(line).length)
  );

  const header = `┏${"━".repeat(textWidth + 2)}┓
${text.split("\n").map(getPaddedLine(textWidth)).join("\n")}
┗${"━".repeat(textWidth + 2)}┛
`;

  console.log(header);
}
