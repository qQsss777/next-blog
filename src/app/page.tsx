import { notFound } from "next/navigation";
import ArticleContainer from "./components/articleContainer";
import React from "react";
import Carousel from "./components/carousel";
import { Box } from "@chakra-ui/react";
import { getArticlesStructure } from "./lib/directoryUtils";

export default async function Home() {
  try {
    const homePath = `${process.cwd()}/${process.env.FOLDER_HOME}page.md`;
    const articlesPath = `${process.cwd()}/${process.env.FOLDER_ARTICLES}`;
    const defaultImage = "/assets/default.jpg";
    const getCardInfos = await getArticlesStructure(
      articlesPath,
      process.env.THUMBNAIL as string,
    );
    return (
      <Box>
        <ArticleContainer path={homePath} name="Home" />
        <Carousel cards={getCardInfos} defaultThumbnail={defaultImage} />
      </Box>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
