# next-blog
This repository contains a static blog generator. It used NextJS.
[blog link](https://qqsss777.github.io/next-blog/)

## Getting Started

First, create and configure .env file with:
- FOLDER_HOME is path to the folder wich contains subfolder with a page.md
- FOLDER_ARTICLES is path to the folder wich contains articles. Each article has a page.mdand medias folder for images
- THUMBNAIL is path to the image folder and thumbnail name. For example /medias/thumbnail.jpg

After, run the development server:

```bash
npm run dev
```

To build this project: 

```bash
npm run build:prod
```

## Deploy
I used Github Actions to deploy to github-pages