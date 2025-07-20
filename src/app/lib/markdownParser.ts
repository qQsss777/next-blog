import crypto from "crypto";
export type IParsedData = {
  textType: keyof HTMLElementTagNameMap;
  content: string | null;
  attributes: Record<string, unknown>;
  children?: IParsedData[];
};

interface IMarkdownParserConstructor {
  rawData: string; //raw data from markodown file
  nextLineCharacter: "\r\n" | "\n"; // next line character
  contextMediaPath: string; // context path for media
}

interface IMarkdownParserProperties extends IMarkdownParserConstructor {
  getParsedData: () => IParsedData[];
  rawData: string;
}

class MarkdownParser implements IMarkdownParserProperties {
  rawData: string;
  nextLineCharacter: "\r\n" | "\n";
  contextMediaPath: string;
  constructor(props: IMarkdownParserConstructor) {
    this.rawData = props.rawData;
    this.nextLineCharacter = props.nextLineCharacter;
    this.contextMediaPath = props.contextMediaPath;
  }

  /**
   * Parse data and class each string bloc
   * @returns parsed data
   */
  getParsedData = (): IParsedData[] => {
    const linesArray = this.rawData.split(this.nextLineCharacter);
    const linesWithCode = this._getCodeElements(linesArray);
    const parsedData: IParsedData[] = [];
    linesWithCode.forEach((line) => {
      if (!line) return;
      const [textType, content] = this._getTextType(line);
      let children;
      if (textType === "p") {
        children = this._getOtherElements(content);
      }
      parsedData.push({
        textType,
        content: children && children.length > 0 ? "" : content,
        children: children,
        attributes: {
          key: crypto.randomUUID(),
        },
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
        if (linesArray[i].includes("```")) {
          if (startCode === false) {
            // début du bloc de code
            startCode = true;
            codeContent += "```";
          } else {
            // fin du bloc de code
            startCode = false;
            codeContent += "```";
            newLinesArray.push(codeContent);
            codeContent = "";
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

  /**
   * Split line if links are present
   * @param line line data
   * @returns list of html data
   */
  _getOtherElements = (line: string): IParsedData[] => {
    const regexLinks = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;
    const regexCode = /```((?:[^`]|`(?!``))*)```/;
    const regexImage = /!\[([^\]]*)\]\(([^)]+)\)/;
    const elements: IParsedData[] = [];
    let matchLink;
    let matchCode;
    let matchImage;
    let lineData = line;
    while (
      (matchImage = regexImage.exec(lineData)) !== null ||
      (matchLink = regexLinks.exec(lineData)) !== null ||
      (matchCode = regexCode.exec(lineData)) !== null
    ) {
      if (matchImage) {
        lineData = this._createHTMLImage(
          matchImage,
          elements,
          lineData,
          this.contextMediaPath,
        );
      } else if (matchLink) {
        lineData = this._createHTMLink(matchLink, elements, lineData);
      } else if (matchCode) {
        lineData = this._createHTMLCode(matchCode, elements, lineData);
      }
    }
    return elements;
  };

  /**
   * Create parsed data for code block
   * @param values list of values from regexExec
   * @param dataArrayReference referenece of the elements array
   * @param line line
   * @returns new line data
   */
  _createHTMLCode = (
    values: RegExpExecArray,
    dataArrayReference: IParsedData[],
    line: string,
  ): string => {
    const lineSplitted = line.split(values[0]);
    dataArrayReference.push({
      attributes: { key: crypto.randomUUID() },
      textType: "span",
      content: lineSplitted.shift() as string,
    });
    const codes = values[1].replaceAll("<br>", "\r");
    dataArrayReference.push({
      textType: "code-block" as keyof HTMLElementTagNameMap,
      content: null,
      attributes: {
        code: codes,
        key: crypto.randomUUID(),
      },
    });
    return lineSplitted.join(",");
  };

  /**
   * Create parsed data for link
   * @param values list of values from regexExec
   * @param dataArrayReference referenece of the elements array
   * @param line line
   * @returns new line data
   */
  _createHTMLink = (
    values: RegExpExecArray,
    dataArrayReference: IParsedData[],
    line: string,
  ): string => {
    const lineSplitted = line.split(values[0]);
    dataArrayReference.push({
      attributes: {
        key: crypto.randomUUID(),
      },
      textType: "span",
      content: lineSplitted.shift() as string,
    });
    dataArrayReference.push({
      textType: "a",
      content: values[1],
      attributes: {
        key: crypto.randomUUID(),
        href: values[2],
        target: "_blank",
      },
    });
    return lineSplitted.join(",");
  };

  /**
   * Create parsed data for link
   * @param values list of values from regexExec
   * @param dataArrayReference referenece of the elements array
   * @param line line
   * @returns new line data
   */
  _createHTMLImage = (
    values: RegExpExecArray,
    dataArrayReference: IParsedData[],
    line: string,
    contextPath: string,
  ): string => {
    const lineSplitted = line.split(values[0]);
    dataArrayReference.push({
      attributes: {
        key: crypto.randomUUID(),
      },
      textType: "span",
      content: lineSplitted.shift() as string,
    });
    const imagePath = values[2].split("/");
    const imageName = imagePath.pop();
    dataArrayReference.push({
      attributes: {
        key: crypto.randomUUID(),
        src: contextPath + imageName,
        alt: values[1],
      },
      textType: "img",
      content: null,
    });
    return lineSplitted.join(",");
  };
}
export default MarkdownParser;
