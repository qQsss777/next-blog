// script to copy media file to distribution
import "dotenv/config";
import { promises as fs } from "fs";
import path from "path";

const basePath = process.cwd();
const folderArticles = basePath + process.env.FOLDER_ARTICLES;
const folderElement = path.basename(folderArticles)
const mediasFolderName = "medias";
const distFolder = `${basePath}/dist/${folderElement}/`;
fs.readdir(folderArticles)
  .then((folders) => {
    folders.forEach((folder) => {
      const folderPath = path.join(folderArticles, folder, mediasFolderName);
      fs.access(folderPath)
        .then(() => {
            fs.cp(folderPath, path.join(distFolder,folder, mediasFolderName), {recursive: true})
        })
        .catch((error) => {
          console.log(error);
        });
    });
  })
  .catch((error) => {
    console.log(error);
  });
