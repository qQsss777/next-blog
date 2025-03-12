"use client";

import { useTheme } from "next-themes";
import { IconButton } from "@chakra-ui/react";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <IconButton
      color={{ base: "#000000", _dark: "#FFFFFF" }}
      bg={{ base: "#f1f0f0", _dark: "#131313" }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Change display mode"
    >
      {isDark ? <IoSunny /> : <FaMoon />}
    </IconButton>
  );
}
