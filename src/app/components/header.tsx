"use client";

import { Box, Flex } from "@chakra-ui/react";
import ThemeChanger from "./themeChanger";

interface IHeaderProps {
  title: string;
}

export default function Header({ title }: IHeaderProps) {
  return (
    <>
      <Box color={{ base: "#000000", _dark: "#FFFFFF" }} p={4} bg={{ base: "#f1f0f0", _dark: "#131313" }}>
        <Flex justify="space-between" align="center">
          <Box>
          {title}
          </Box>
          <ThemeChanger />
        </Flex>
      </Box>
      <Box p={4}></Box>
    </>
  );
}
