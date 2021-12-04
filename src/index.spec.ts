import assert from 'assert';
import { generateSummary } from './index';

describe('generateSummary', () => {
  const config = {
    maxLength: 50,
    beforeLength: 20,
  };
  const text =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

  it('near the top', () => {
    const keyword = 'ipsum';
    const summary = generateSummary(text, keyword, config);
    assert.strictEqual(summary.isBeforeEllipsed, false);
    assert.strictEqual(summary.beforeText, 'Lorem ');
    assert.strictEqual(summary.keyword, 'ipsum');
    assert.strictEqual(summary.afterText, ' dolor sit amet, consectetur adipiscing');
    assert.strictEqual(summary.isAfterEllipsed, true);
    assert.strictEqual((summary.beforeText + summary.keyword + summary.afterText).length, config.maxLength);
  });
  it('in the middle', () => {
    const keyword = 'Ut enim';
    const summary = generateSummary(text, keyword, config);
    assert.strictEqual(summary.isBeforeEllipsed, true);
    assert.strictEqual(summary.beforeText, 'olore magna aliqua. ');
    assert.strictEqual(summary.keyword, 'Ut enim');
    assert.strictEqual(summary.afterText, ' ad minim veniam, quis ');
    assert.strictEqual(summary.isAfterEllipsed, true);
    assert.strictEqual((summary.beforeText + summary.keyword + summary.afterText).length, config.maxLength);
  });
  it('near the end', () => {
    const keyword = 'commodo';
    const summary = generateSummary(text, keyword, config);
    assert.strictEqual(summary.isBeforeEllipsed, true);
    assert.strictEqual(summary.beforeText, 'si ut aliquip ex ea ');
    assert.strictEqual(summary.keyword, 'commodo');
    assert.strictEqual(summary.afterText, ' consequat.');
    assert.strictEqual(summary.isAfterEllipsed, false);
    // notEqual because beforeLength should be fixed
    assert.notEqual((summary.beforeText + summary.keyword + summary.afterText).length, config.maxLength);
  });
});
