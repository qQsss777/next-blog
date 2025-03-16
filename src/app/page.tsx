import { notFound } from "next/navigation";
import ArticleContainer from "./components/articleContainer";
import { homePath } from "./constants";
import React from "react";

export default async function Home() {
  try {
    const path = process.cwd() + homePath + "/page.md";
    return <ArticleContainer path={path} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
