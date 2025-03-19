import { Box } from "@chakra-ui/react";
import { getFileAsString } from "../lib/directoryUtils";
import MarkdownParser from "../lib/markdownParser";
import React from "react";
import { createReactChild } from "../lib/reactUtils";

interface IArticleContainer {
  path: string; //path where locate article data
}

/**
 * Display article content in a box
 * @param props IArticleContainer
 * @returns React Element
 */
const ArticleContainer = async (props: IArticleContainer) => {
  try {
    const rawData = await getFileAsString(props.path);
    const nextLineCharacter = process.platform === "win32" ? "\r\n" : "\n";
    const markdownParser = new MarkdownParser({
      nextLineCharacter,
      rawData,
    });
    const data = markdownParser.getParsedData();
    const htmlElements = data.map((element) => {
      return createReactChild(element);
    });
    return (
      <Box p="10">
        <Box p="10">{htmlElements}</Box>
      </Box>
    );
  } catch (error) {
    console.error(error);
    return <div>Erreur de récupération du contenu</div>;
  }
};

export default ArticleContainer;
