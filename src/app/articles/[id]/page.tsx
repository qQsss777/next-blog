import styles from "../../page.module.css";
import { promises as fs } from "fs";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const articlesPath = "/public/articles";

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    const folders = await fs.readdir(process.cwd() + articlesPath);
    return folders.map((folder) => {
      return { id: folder };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const { title } = await parent;
  return {
    title: `${title?.absolute} - ${id}`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  try {
    const { id } = await params;
    const path = process.cwd() + articlesPath + "/" + id + "/page.md";
    const buffer = await fs.readFile(path, { encoding: "utf-8" });
    const nextLineCharacter = process.platform === "win32" ? "\r\n" : "\n";
    const lines = buffer.split(nextLineCharacter);
    console.log(lines);
    return <div className={styles.page}>{buffer}</div>;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
