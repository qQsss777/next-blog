"use client";

import {
  Drawer,
  Portal,
  IconButton,
  CloseButton,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import Link from "next/link";

interface IDrawer {
  title: string;
  contextPath: string;
  rootPath: string;
  linkTitles: string[];
}
export default function DrawerLink({
  linkTitles,
  title,
  contextPath,
}: IDrawer) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer.Root
      size="xs"
      placement="start"
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
    >
      <Drawer.Trigger asChild>
        <IconButton aria-label="Open menu">
          <CiMenuBurger />
        </IconButton>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>{title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Flex direction="column" gapY="5">
                <Link href="/">Accueil</Link>
                {linkTitles.map((lk) => (
                  <Link key={lk} href={contextPath + lk}>
                    {lk}
                  </Link>
                ))}
              </Flex>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
