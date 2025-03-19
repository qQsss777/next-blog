export type IParsedData = {
  textType: keyof HTMLElementTagNameMap;
  content: string;
  attributes?: Record<string, string>;
  children?: IParsedData[];
};

interface IMarkdownParserConstructor {
  rawData: string; //raw data from markodown file
  nextLineCharacter: "\r\n" | "\n"; // next line character
}

interface IMarkdownParserProperties extends IMarkdownParserConstructor {
  getParsedData: () => IParsedData[];
  rawData: string;
}

class MarkdownParser implements IMarkdownParserProperties {
  rawData: string;
  nextLineCharacter: "\r\n" | "\n";
  constructor(props: IMarkdownParserConstructor) {
    this.rawData = props.rawData;
    this.nextLineCharacter = props.nextLineCharacter;
  }

  /**
   * Parse data and class each string bloc
   * @returns parsed data
   */
  getParsedData = (): IParsedData[] => {
    const lines = this.rawData.split(this.nextLineCharacter);
    const parsedData: IParsedData[] = [];
    lines.forEach((line) => {
      if (!line) return;
      const [textType, content] = this._getTextType(line);
      let children;
      if (textType === "p") {
        children = this._getLinkElements(content);
      }
      parsedData.push({
        textType,
        content: children && children.length > 0 ? "" : content,
        children: children,
      });
    });
    return parsedData;
  };

  /**
   * Get text type and new string
   * @param line line data
   */
  _getTextType = (line: string): [keyof HTMLElementTagNameMap, string] => {
    if (line.startsWith("#")) {
      let titleLevel = 0;
      const str = line.split("");
      for (const s of str) {
        if (s === "#") {
          titleLevel++;
        } else {
          break;
        }
      }
      const htmlSectionTitle =
        `h${Math.min(titleLevel, 6)}` as keyof HTMLElementTagNameMap;
      const content = line.substring(titleLevel).trim();
      return [htmlSectionTitle, content];
    } else {
      return ["p", line];
    }
  };

  /**
   * Split line if links are present
   * @param line line data
   * @returns
   */
  _getLinkElements = (line: string) => {
    const regexLinks = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
    const elements: IParsedData[] = [];
    let match;
    let lineData = line;
    while ((match = regexLinks.exec(lineData)) !== null) {
      const lineSplitted = line.split(match[0]);
      elements.push({
        textType: "span",
        content: lineSplitted.shift() as string,
      });
      elements.push({
        textType: "a",
        content: match[1],
        attributes: {
          href: match[2],
          target: "_blank",
        },
      });
      lineData = lineSplitted.join(",");
    }
    return elements;
  };
}
export default MarkdownParser;
