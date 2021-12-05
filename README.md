# search-summary

Generate a search result string, supports ellipsis.

## Install

```
$ npm install search-summary
```

## Usage

```js
import { generateSummary } from 'search-summary';

const config = {
  ellipsisToken: '...',
  keywordModifier: (keyword) => `**${keyword}**`
};
const text = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

generateSummary(text, 'Ut enim', config);
// '...olore magna aliqua. **Ut enim** ad minim veniam, quis ...'
generateSummary(text, 'commodo', config);
// '...si ut aliquip ex ea **commodo** consequat.'
generateSummary(text, 'ipsum', config);
// 'Lorem **ipsum** dolor sit amet, consectetur adipiscing...'
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

See also [index.spec.ts](https://github.com/kyonenya/search-summary/blob/main/src/index.spec.ts).

## Configure

```js
// example: default config
const config = {
  maxLength: 50,
  beforeLength: 20,
  elipsisToken: '...',
  keywordModifier: (keyword: string) => keyword,
};
generateSummary(text, keyword, config);
```

Or you can pass the config beforehand.

```js
import { generateSummaryFactory, generateSummaryEntityFactory } from 'search-summary';

const generateSummary = generateSummaryFactory(config);
generateSummary(text, keyword1);
generateSummary(text, keyword2);

const generateSummaryEntity = generateSummaryEntityFactory(config);
generateSummaryEntity(text, keyword1);
generateSummaryEntity(text, keyword2);
```

## License

MIT © [kyonenya](https://github.com/kyonenya)
