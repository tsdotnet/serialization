<a name="banner"><img src="https://cdn.jsdelivr.net/gh/tsdotnet/serialization@master/assets/banner.svg" alt="@tsdotnet/serialization: Values to text, and back. Serialize primitives and your own types."></a>

[![npm version](https://img.shields.io/npm/v/@tsdotnet/serialization.svg?style=flat-square)](https://www.npmjs.com/package/@tsdotnet/serialization)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/tsdotnet/serialization/blob/master/LICENSE)

Convert primitives and `Serializable` objects to strings with `toString`, and strings back with `toPrimitive`.

## Install

```sh
npm install @tsdotnet/serialization
```

## Usage

```ts
import { toString, toPrimitive } from '@tsdotnet/serialization';

toString(42);          // '42'
toString(true);        // 'true'
toPrimitive('3.5');    // 3.5
toPrimitive('false');  // false
```

`toString` also accepts any object with a `serialize(): string` method (`Serializable`). Unknown types throw unless you pass a default.

## Use it from

ESM (`import { toString, toPrimitive } from '@tsdotnet/serialization';`) or CommonJS (`const { toString, toPrimitive } = require('@tsdotnet/serialization');`).

<details><summary>In a browser, without a bundler</summary>

```html
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/exceptions@1/dist/umd/exceptions.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/type@1/dist/umd/type.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tsdotnet/serialization@1/dist/umd/serialization.min.js"></script>
<script>
  const { toString, toPrimitive } = tsdotnet.serialization;
</script>
```

</details>

## Docs

[tsdotnet.github.io/serialization](https://tsdotnet.github.io/serialization/)
