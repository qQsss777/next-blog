import { notFound } from "next/navigation";
import ArticleContainer from "./components/articleContainer";
import { homePath } from "./constants";
import { getFileAsString } from "./lib/directoryUtils";
import MarkdownParser from "./lib/markdownParser";

export default async function Home() {
  try {
    const path = process.cwd() + homePath + "/page.md";
    const rawData = await getFileAsString(path);
    const nextLineCharacter = process.platform === "win32" ? "\r\n" : "\n";
    const markdownParser = new MarkdownParser({
      nextLineCharacter,
      rawData,
    });
    const data = markdownParser.getParsedData();
    return (
      <ArticleContainer>
        <div>{data.toString()}</div>
        <div>{data.toString()}</div>
      </ArticleContainer>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
