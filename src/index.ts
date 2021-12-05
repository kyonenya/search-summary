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

export function generateSummaryEntity(
  text: string,
  keyword: string,
  config?: SummaryConfig
): SummaryEntity | undefined {
  const { maxLength = 50, beforeLength = 20 } = config ?? {};
  const afterLength = maxLength - beforeLength - keyword.length;

  const keywordIndex = text.indexOf(keyword);
  if (keywordIndex === -1) return;
  const beforeIndex = keywordIndex - beforeLength;
  const afterIndex = keywordIndex + keyword.length;

  const isNearTop = beforeIndex <= 0;

  return {
    isBeforeEllipsed: !isNearTop,
    beforeText: isNearTop
      ? text.substr(0, keywordIndex)
      : text.substr(beforeIndex, beforeLength),
    keyword: text.substr(keywordIndex, keyword.length),
    afterText: isNearTop
      ? text.substr(afterIndex, maxLength - afterIndex)
      : text.substr(afterIndex, afterLength),
    isAfterEllipsed: beforeIndex + maxLength < text.length,
  };
}

export type SummaryConfig = SummaryEntityConfig & {
  elipsisToken?: string;
  keywordModifier?: (keyword: string) => string;
};

export function generateSummary(
  text: string,
  keyword: string,
  config?: SummaryConfig
): string | undefined {
  const summary = generateSummaryEntity(text, keyword, config);
  if (summary === undefined) return;
  const {
    elipsisToken = '...',
    keywordModifier = (keyword: string) => keyword,
  } = config ?? {};

  return (
    (summary.isBeforeEllipsed ? elipsisToken : '') +
    summary.beforeText +
    keywordModifier(summary.keyword) +
    summary.afterText +
    (summary.isAfterEllipsed ? elipsisToken : '')
  );
}
