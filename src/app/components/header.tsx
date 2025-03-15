import { Box, Flex } from "@chakra-ui/react";
import ThemeChanger from "./themeChanger";
import DrawerLink from "./drawerLink";

interface IHeaderProps {
  title: string;
  articles: string[];
  rootPath: string;
}

export default function Header({ title, articles }: IHeaderProps) {
  return (
    <>
      <Box
        color={{ base: "#000000", _dark: "#FFFFFF" }}
        p={4}
        bg={{ base: "#f1f0f0", _dark: "#131313" }}
        position="sticky"
        top="0"
        left="0"
        right="0"
        zIndex="10"
      >
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="5">
            <DrawerLink
              title="Lien vers les articles"
              rootPath="/"
              linkTitles={articles}
              contextPath={"/articles/"}
            />
            {title}
          </Flex>
          <ThemeChanger />
        </Flex>
      </Box>
    </>
  );
}
