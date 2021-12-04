export type Summary = {
  isBeforeEllipsed: boolean;
  beforeText: string;
  keyword: string;
  afterText: string;
  isAfterEllipsed: boolean;
};

export type SummaryConfig = {
  wholeLength: number;
  beforeLength: number;
};

export function generateSummary(
  text: string,
  keyword: string,
  config?: SummaryConfig
): Summary {
  const { wholeLength = 50, beforeLength = 20 } = config ?? {};

  const afterLength = wholeLength - beforeLength - keyword.length;
  const keywordIndex = text.indexOf(keyword);
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
      ? text.substr(afterIndex, wholeLength - afterIndex)
      : text.substr(afterIndex, afterLength),
    isAfterEllipsed: beforeIndex + wholeLength < text.length,
  };
}
