import { promises as fs } from "fs";
import path from "path";
import { ICardInfos } from "../components/carousel";

/**
 * Get all folder name from a parent folder
 * @param path parent folder path
 * @returns list of folder name
 */
export const getSubFoldersName = async (path: string): Promise<string[]> => {
  try {
    return await fs.readdir(path);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get folder");
  }
};

/**
 * Read file as text file
 * @param path path of the file
 * @returns content of file as string
 */
export const getFileAsString = async (path: string): Promise<string> => {
  try {
    return await fs.readFile(path, { encoding: "utf-8" });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get file");
  }
};

/**
 * Get last element of path directory
 * @param pathValue path
 * @returns last element
 */
export const getBaseName = (pathValue: string): string => {
  return path.basename(pathValue);
};

/**
 * Get card infos
 * @param articlePath article path
 * @param thumbnailPath thumbnail path @TODO create recursive search on name
 * @returns
 */
export const getArticlesStructure = async (
  articlePath: string,
  thumbnailPath: string,
): Promise<ICardInfos[]> => {
  try {
    const baseName = path.basename(articlePath);
    const folders = await fs.readdir(articlePath);
    return await Promise.all(
      folders.map(async (folder) => {
        let thumbnail;
        try {
          await fs.access(path.join(articlePath, folder, thumbnailPath));
          thumbnail = path.join(baseName, folder, thumbnailPath);
        } catch {
          console.warn("no thumbnail found.");
        }
        return {
          title: folder,
          thumbnail: thumbnail,
          path: path.join(baseName, folder),
        };
      }),
    );
  } catch (error) {
    console.error(error);
    throw new Error("Failed to cards info");
  }
};
