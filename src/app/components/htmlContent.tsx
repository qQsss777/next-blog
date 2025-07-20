"use client";
//register web component
import "@qqsss777/oul-web-components";
import { IParsedData } from "../lib/markdownParser";
import { createReactChild } from "../lib/reactUtils";

interface IHTMLContent {
  element: IParsedData;
}

export default function HTMLContent(props: IHTMLContent) {
  const element = props.element;
  return (
    <div key={element.attributes.key as string}>
      {createReactChild(element)}
    </div>
  );
}
