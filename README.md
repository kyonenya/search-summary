# search-summary

Generate a summarized search result string. Zero dependency utils.

[search-summary - npm](https://www.npmjs.com/package/search-summary)

## Install

```
npm install search-summary
```

## Usage

```js
import { generateSummary } from 'search-summary';

const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const config = {
  ellipsisToken: '...',
  keywordModifier: (keyword) => `**${keyword}**`
};

generateSummary(text, 'ipsum', config);
// 'Lorem **ipsum** dolor sit amet, consectetur adipiscing...'

generateSummary(text, 'Ut enim', config);
// '...olore magna aliqua. **Ut enim** ad minim veniam, quis ...'

generateSummary(text, 'commodo', config);
// '...si ut aliquip ex ea **commodo** consequat.'

generateSummary(text, 'dummy keyword', config);
// undefined
```

Or you can get an object.

```js
import { generateSummaryEntity } from 'search-summary';

generateSummaryEntity(text, 'ipsum');
// {
//   isBeforeEllipsed: false,
//   beforeText: 'Lorem ',
//   keyword: 'ipsum',
//   afterText: ' dolor sit amet, consectetur adipiscing',
//   isAfterEllipsed: true
// }
```

## Configure

```js
// example: default config
generateSummary(text, keyword, {
  maxLength: 50,
  beforeLength: 20,
  ellipsisToken: '...',
  keywordModifier: (keyword: string) => keyword,
});

generateSummaryEntity(text, keyword, {
  maxLength: 50,
  beforeLength: 20,
});
```

Or you can pass the config in advance.

```js
import { generateSummaryFactory, generateSummaryEntityFactory } from 'search-summary';

const generateSummary = generateSummaryFactory(config);
generateSummary(text, keyword);

const generateSummaryEntity = generateSummaryEntityFactory(config);
generateSummaryEntity(text, keyword);
```

## License

MIT © [kyonenya](https://github.com/kyonenya)
