import { Box } from "@chakra-ui/react";
import { getFileAsString } from "../lib/directoryUtils";
import MarkdownParser from "../lib/markdownParser";
import React from "react";

interface IArticleContainer {
  path: string;
}

const ArticleContainer = async (props: IArticleContainer) => {
  try {
    const rawData = await getFileAsString(props.path);
    const nextLineCharacter = process.platform === "win32" ? "\r\n" : "\n";
    const markdownParser = new MarkdownParser({
      nextLineCharacter,
      rawData,
    });
    const data = markdownParser.getParsedData();
    const htmlElements = data.map((d) => {
      return React.createElement(d.textType, {}, d.content);
    });
    return <Box p="10">{htmlElements}</Box>;
  } catch (error) {
    console.error(error);
    return <div>Erreur de récupération du contenu</div>;
  }
};

export default ArticleContainer;
