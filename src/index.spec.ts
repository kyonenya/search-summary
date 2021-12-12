import assert from 'assert';
import { generateSummaryEntity } from './index';

describe('generateSummaryEntity', () => {
  const text =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  const config = {
    maxLength: 50,
    beforeLength: 20,
  };

  it('near the top', () => {
    const keyword = 'ipsum';
    const summary = generateSummaryEntity(text, keyword, config);
    assert.strictEqual(summary?.isBeforeEllipsed, false);
    assert.strictEqual(summary?.beforeText, 'Lorem ');
    assert.strictEqual(summary?.keyword, 'ipsum');
    assert.strictEqual(
      summary?.afterText,
      ' dolor sit amet, consectetur adipiscing'
    );
    assert.strictEqual(summary.isAfterEllipsed, true);
    assert.strictEqual(
      (summary?.beforeText + summary?.keyword + summary?.afterText).length,
      config.maxLength
    );
  });
  it('in the middle', () => {
    const keyword = 'Ut enim';
    const summary = generateSummaryEntity(text, keyword, config);
    assert.strictEqual(summary?.isBeforeEllipsed, true);
    assert.strictEqual(summary?.beforeText, 'olore magna aliqua. ');
    assert.strictEqual(summary?.keyword, 'Ut enim');
    assert.strictEqual(summary?.afterText, ' ad minim veniam, quis ');
    assert.strictEqual(summary?.isAfterEllipsed, true);
    assert.strictEqual(
      (summary?.beforeText + summary?.keyword + summary?.afterText).length,
      config.maxLength
    );
  });
  it('near the end', () => {
    const keyword = 'commodo';
    const summary = generateSummaryEntity(text, keyword, config);
    assert.strictEqual(summary?.isBeforeEllipsed, true);
    assert.strictEqual(summary?.beforeText, 'si ut aliquip ex ea ');
    assert.strictEqual(summary?.keyword, 'commodo');
    assert.strictEqual(summary?.afterText, ' consequat.');
    assert.strictEqual(summary?.isAfterEllipsed, false);
    // notEqual because beforeLength should be fixed
    assert.notEqual(
      (summary?.beforeText + summary?.keyword + summary?.afterText).length,
      config.maxLength
    );
  });
  it('short', () => {
    const shortText = 'Lorem ipsum dolor sit amet';
    const keyword = 'ipsum';
    const summary = generateSummaryEntity(shortText, keyword, config);
    assert.strictEqual(summary?.isBeforeEllipsed, false);
    assert.strictEqual(summary?.beforeText, 'Lorem ');
    assert.strictEqual(summary?.keyword, 'ipsum');
    assert.strictEqual(summary?.afterText, ' dolor sit amet');
    assert.strictEqual(summary?.isAfterEllipsed, false);
  });
  it('not matched', () => {
    const keyword = 'dummy keyword';
    const summary = generateSummaryEntity(text, keyword, config);
    assert.strictEqual(summary, undefined);
  });
});
