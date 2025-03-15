import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";

interface IArticleContainer {
  children: ReactNode[];
}

const ArticleContainer = (props: IArticleContainer) => {
  return <Box p="10">{props.children}</Box>;
};

export default ArticleContainer;
