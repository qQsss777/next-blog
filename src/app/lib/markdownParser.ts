type IParsedData = {
  textType: keyof HTMLElementTagNameMap;
  content: string;
};

interface IMarkdownParserConstructor {
  rawData: string;
  nextLineCharacter: "\r\n" | "\n";
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
      parsedData.push({
        textType,
        content,
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
}
export default MarkdownParser;
