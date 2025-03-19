export type IParsedData = {
  textType: keyof HTMLElementTagNameMap;
  content: string;
  attributes?: Record<string, unknown>;
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
    const linesArray = this.rawData.split(this.nextLineCharacter);
    const newLinesArray = this._getCodeElements(linesArray);
    const parsedData: IParsedData[] = [];
    newLinesArray.forEach((line) => {
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
   * @returns list of html data
   */
  _getLinkElements = (line: string): IParsedData[] => {
    const regexLinks = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;
    const regexCode = /```([^`]+)```/;
    const elements: IParsedData[] = [];
    let matchLink;
    let matchCode;
    let lineData = line;
    while (
      (matchLink = regexLinks.exec(lineData)) !== null ||
      (matchCode = regexCode.exec(lineData)) !== null
    ) {
      if (matchLink) {
        const lineSplitted = lineData.split(matchLink[0]);
        elements.push({
          textType: "span",
          content: lineSplitted.shift() as string,
        });
        elements.push({
          textType: "a",
          content: matchLink[1],
          attributes: {
            href: matchLink[2],
            target: "_blank",
          },
        });
        lineData = lineSplitted.join(",");
      } else if (matchCode) {
        const lineSplitted = lineData.split(matchCode[0]);
        elements.push({
          textType: "span",
          content: lineSplitted.shift() as string,
        });
        const numberLines = matchCode[1].split("<br>");
        const codes = matchCode[1].replaceAll("<br>", "\r");
        elements.push({
          textType: "textarea",
          content: codes,
          attributes: {
            readOnly: true,
            style: {
              height: `${30 * numberLines.length}px`,
            },
          },
        });
        lineData = lineSplitted.join(",");
      }
    }
    return elements;
  };

  /**
   * Reconstruct code line
   * @param linesArray line list
   * @returns line list with code concatenate
   */
  _getCodeElements = (linesArray: string[]): string[] => {
    // si ça inclut un code on retravaille la liste
    if (linesArray.includes("```")) {
      const newLinesArray = [];
      let startCode = false;
      let codeContent = "";

      for (let i = 0; i < linesArray.length; i++) {
        if (linesArray[i] === "```") {
          if (startCode === false) {
            // début du bloc de code
            startCode = true;
            codeContent += "```";
          } else {
            // fin du bloc de code
            startCode = false;
            codeContent += "```";
            newLinesArray.push(codeContent);
          }
        } else if (startCode) {
          // ajout du contenu du code avec marquage du retour à la ligne
          codeContent += linesArray[i];
          codeContent += "<br>";
        } else {
          // on ajout les lignes normalement
          newLinesArray.push(linesArray[i]);
        }
      }
      return newLinesArray;
    } else {
      return linesArray;
    }
  };
}
export default MarkdownParser;
