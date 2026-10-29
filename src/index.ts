export type SummaryEntity = {
  isBeforeEllipsed: boolean;
  beforeText: string;
  keyword: string;
  afterText: string;
  isAfterEllipsed: boolean;
};

export type SummaryEntityConfig = {
  maxLength?: number;
  beforeLength?: number;
};

export const generateSummaryEntityFactory =
  (config?: SummaryConfig) =>
  (text: string, keyword: string | undefined): SummaryEntity | undefined => {
    if (keyword === undefined) return;
    const { maxLength = 50, beforeLength = 20 } = config ?? {};
    const keywordOffset = text.indexOf(keyword);
    if (keywordOffset === -1) return;

    const afterOffset = keywordOffset + keyword.length;
    const charsStartOffset = Math.max(0, keywordOffset - beforeLength * 2); // slice generously, then trim
    const keywordIndex = [...text.slice(charsStartOffset, keywordOffset)]
      .length;
    const beforeIndex = Math.max(0, keywordIndex - beforeLength);
    const afterIndex = keywordIndex + [...keyword].length;
    const endIndex = Math.max(afterIndex, beforeIndex + maxLength);
    const charsEndOffset = afterOffset + (endIndex - afterIndex) * 2;

    const chars = [...text.slice(charsStartOffset, charsEndOffset)];
    const beforeText = chars.slice(beforeIndex, keywordIndex).join('');
    const afterText = chars.slice(afterIndex, endIndex).join('');

    return {
      isBeforeEllipsed: beforeText.length < keywordOffset,
      beforeText,
      keyword,
      afterText,
      isAfterEllipsed: afterOffset + afterText.length < text.length,
    };
  };

export const generateSummaryEntity = (
  text: string,
  keyword: string | undefined,
  config?: SummaryConfig,
): SummaryEntity | undefined =>
  generateSummaryEntityFactory(config)(text, keyword);

export type SummaryConfig = SummaryEntityConfig & {
  ellipsisToken?: string;
  keywordModifier?: (keyword: string) => string;
};

export const generateSummaryFactory =
  (config?: SummaryConfig) =>
  (text: string, keyword: string | undefined): string | undefined => {
    const summary = generateSummaryEntity(text, keyword, config);
    if (summary === undefined) return;
    const {
      ellipsisToken = '...',
      keywordModifier = (keyword: string) => keyword,
    } = config ?? {};

    return (
      (summary.isBeforeEllipsed ? ellipsisToken : '') +
      summary.beforeText +
      keywordModifier(summary.keyword) +
      summary.afterText +
      (summary.isAfterEllipsed ? ellipsisToken : '')
    );
  };

export const generateSummary = (
  text: string,
  keyword: string | undefined,
  config?: SummaryConfig,
): string | undefined => generateSummaryFactory(config)(text, keyword);
