import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { getSubFoldersName } from "@/app/lib/directoryUtils";
import ArticleContainer from "@/app/components/articleContainer";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateStaticParams(): Promise<{ id: string }[]> {
  try {
    const folders = await getSubFoldersName(
      process.cwd() + process.env.FOLDER_ARTICLES,
    );
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
    const path = `${process.cwd()}/${process.env.FOLDER_ARTICLES}${id}/page.md`;
    return <ArticleContainer path={path} name={id} />;
  } catch (error) {
    console.error(error);
    notFound();
  }
}
