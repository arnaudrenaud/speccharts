import packageJson from "../../package.json";

export function printHeader() {
  const text = `${packageJson.name} v${packageJson.version}`;

  const header = `┏${"━".repeat(text.length + 2)}┓
┃ ${text} ┃
┗${"━".repeat(text.length + 2)}┛
`;

  console.log(header);
}
