"use client";

import { useTheme } from "next-themes";
import { IconButton } from "@chakra-ui/react";
import { FaMoon } from "react-icons/fa";
import { IoSunny } from "react-icons/io5";

export default function ThemeChanger() {
  const { theme, setTheme } = useTheme();
  if (theme === "light") {
    return (
      <IconButton
        onClick={() => setTheme("dark")}
        aria-label="Change display mode"
      >
        <FaMoon />
      </IconButton>
    );
  } else {
    return (
      <IconButton
        onClick={() => setTheme("light")}
        aria-label="Change display mode"
      >
        <IoSunny />
      </IconButton>
    );
  }
}
