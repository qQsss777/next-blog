import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { getFileAsString, getSubFoldersName } from "@/app/lib/directoryUtils";
import { articlesPath } from "@/app/constants";
import Header from "@/app/components/header";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    const folders = await getSubFoldersName(process.cwd() + articlesPath);
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
    const buffer = await getFileAsString(path);
    const nextLineCharacter = process.platform === "win32" ? "\r\n" : "\n";
    const lines = buffer.split(nextLineCharacter);
    console.log(lines);
    return <Header title={id} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
