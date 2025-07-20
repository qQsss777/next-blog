"use client";

import dynamic from "next/dynamic";

// Import dynamique avec désactivation du SSR
const HTMLContent = dynamic(() => import("./htmlContent"), {
  ssr: false,
});

export default HTMLContent;
