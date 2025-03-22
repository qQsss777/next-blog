import { notFound } from "next/navigation";
import ArticleContainer from "./components/articleContainer";
import React from "react";

export default async function Home() {
  try {
    const path = `${process.cwd()}/${process.env.FOLDER_HOME}page.md`;
    return <ArticleContainer path={path} name="Home" />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
