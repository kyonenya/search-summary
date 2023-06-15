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
    const keywordIndex = text.indexOf(keyword);
    if (keywordIndex === -1) return;
    const beforeIndex =
      keywordIndex - beforeLength <= 0 ? 0 : keywordIndex - beforeLength;
    const afterIndex = keywordIndex + keyword.length;
    const endIndex = beforeIndex + maxLength;

    return {
      isBeforeEllipsed: beforeIndex !== 0,
      beforeText: text.substring(beforeIndex, keywordIndex),
      keyword: text.substring(keywordIndex, afterIndex),
      afterText: text.substring(afterIndex, endIndex),
      isAfterEllipsed: endIndex < text.length,
    };
  };

export const generateSummaryEntity = (
  text: string,
  keyword: string | undefined,
  config?: SummaryConfig
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
  config?: SummaryConfig
): string | undefined => generateSummaryFactory(config)(text, keyword);
