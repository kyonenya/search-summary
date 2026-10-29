import assert from 'assert';
import { describe, it } from 'node:test';
import { generateSummaryEntity } from './index.ts';

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
      ' dolor sit amet, consectetur adipiscing',
    );
    assert.strictEqual(summary.isAfterEllipsed, true);
    assert.strictEqual(
      (summary?.beforeText + summary?.keyword + summary?.afterText).length,
      config.maxLength,
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
      config.maxLength,
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
      config.maxLength,
    );
  });
  it('maxLength is too short but the keyword reaches the end', () => {
    const summary = generateSummaryEntity(text, 'consequat.', {
      ...config,
      maxLength: 10,
    });
    assert.deepStrictEqual(summary, {
      isBeforeEllipsed: true,
      beforeText: 'iquip ex ea commodo ',
      keyword: 'consequat.',
      afterText: '',
      isAfterEllipsed: false,
    });
  });
  it('short', () => {
    const text = 'Lorem ipsum dolor sit amet';
    const keyword = 'ipsum';
    const summary = generateSummaryEntity(text, keyword, config);
    assert.strictEqual(summary?.isBeforeEllipsed, false);
    assert.strictEqual(summary?.beforeText, 'Lorem ');
    assert.strictEqual(summary?.keyword, 'ipsum');
    assert.strictEqual(summary?.afterText, ' dolor sit amet');
    assert.strictEqual(summary?.isAfterEllipsed, false);
  });
  it('multibyte characters', () => {
    const text = 'Lorem 😀 ipsum😀 dolor 😀';
    const keyword = 'ipsum😀';
    const config = {
      maxLength: 16,
      beforeLength: 2,
    };
    const summary = generateSummaryEntity(text, keyword, config);
    assert.strictEqual(summary?.isBeforeEllipsed, true);
    assert.strictEqual(summary?.beforeText, '😀 ');
    assert.strictEqual(summary?.keyword, keyword);
    assert.strictEqual(summary?.afterText, ' dolor 😀');
    assert.strictEqual(summary?.isAfterEllipsed, false);
    assert.strictEqual(
      [...(summary?.beforeText + summary?.keyword + summary?.afterText)].length,
      config.maxLength,
    );
  });
  it('same length', () => {
    const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing';
    assert.strictEqual(text.length, config.maxLength); // same length
    const keyword = 'ipsum';
    const summary = generateSummaryEntity(text, keyword, config);
    assert.strictEqual(summary?.isBeforeEllipsed, false); // not ellipsed
    assert.strictEqual(summary?.beforeText, 'Lorem ');
    assert.strictEqual(summary?.keyword, 'ipsum');
    assert.strictEqual(
      summary?.afterText,
      ' dolor sit amet, consectetur adipiscing',
    );
    assert.strictEqual(summary?.isAfterEllipsed, false); // not ellipsed
  });
  it('not matched', () => {
    const keyword = 'dummy keyword';
    const summary = generateSummaryEntity(text, keyword, config);
    assert.strictEqual(summary, undefined);
  });
  it('undefined', () => {
    const keyword = undefined;
    const summary = generateSummaryEntity(text, keyword, config);
    assert.strictEqual(summary, undefined);
  });
});
