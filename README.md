# TOOSOON PRNG

TOOSOON pseudo-random number generator utility functions & helpers.

## Installation

Yarn:

```properties
$ yarn add toosoon-prng
```

NPM:

```properties
$ npm install toosoon-prng
```

## Usage

PRNG:

```ts
import prng from 'toosoon-prng';

prng.setSeed('010101');
console.log(prng.randomFloat('angle', 0, Math.PI)); // Pseudo-random float number in the interval [0, 3.14...]
```

PRNG Controllers:

```ts
import {
  BooleanController,
  SignController,
  FloatController,
  IntController,
  HexColorController,
  ItemController,
  ObjectPropertyController,
  WeightsController,
  BooleanGroupController,
  SignGroupController,
  FloatGroupController,
  IntGroupController,
  HexColorGroupController,
  ItemGroupController,
  ObjectPropertyGroupController,
  WeightsGroupController
} from 'toosoon-prng';

const seed = '010101';

const config = {
  // Controllers
  boolean: new BooleanController(`${seed}-boolean`, 0.5),
  sign: new SignController(`${seed}-sign`, 0.5),
  float: new FloatController(`${seed}-float`, 0, 1),
  int: new IntController(`${seed}-int`, 0, 10),
  hex: new HexColorController(`${seed}-hex`),
  item: new ItemController<number>(`${seed}-item`, [0, 0.5, 1]),
  property: new ObjectPropertyController<boolean>(`${seed}-property`, { foo: true, bar: false }),
  value: new WeightsController<string>(`${seed}-value`, [
    { weight: 0.5, value: 'foo' },
    { weight: 2, value: 'bar' }
  ]),
  // Group Controllers
  groupBoolean: new BooleanGroupController(`${seed}-group-boolean`, 0.5),
  groupSign: new SignGroupController(`${seed}-group-sign`, 0.5),
  groupFloat: new FloatGroupController(`${seed}-group-float`, 0, 1),
  groupInt: new IntGroupController(`${seed}-group-int`, 0, 10),
  groupHex: new HexColorGroupController(`${seed}-group-hex`),
  groupItem: new ItemGroupController<number>(`${seed}-group-item`, [0, 0.5, 1]),
  groupProperty: new ObjectPropertyGroupController<boolean>(`${seed}-group-property`, { foo: true, bar: false }),
  groupValue: new WeightsGroupController<string>(`${seed}-group-value`, [
    { weight: 0.5, value: 'foo' },
    { weight: 2, value: 'bar' }
  ])
};
```

## PRNG Functions

```ts
// Set PRNG instance seed
prng.setSeed(seed: string) => void;
```

```ts
// Set PRNG instance method
prng.setMethod(method: PRNGMethod) => void;
```

```ts
// Generate a pseudo-random number in the interval [0, 1] (PRNG equivalent of Math.random)
prng.random(seed: string) => number;
```

```ts
// Generate a pseudo-random boolean (true or false)
prng.randomBoolean(seed: string, probability?: number) => boolean;
```

```ts
// Generate a pseudo-random sign (1 or -1)
prng.randomSign(seed: string, probability?: number) => number;
```

```ts
// Generate a pseudo-random float number
prng.randomFloat(seed: string, min?: number, max?: number1, precision?: number) => number;
```

```ts
// Generate a pseudo-random integer number
prng.randomInt(seed: string, min: number, max: number) => void;
```

```ts
// Generate a pseudo-random hexadecimal color
prng.randomHexColor(seed: string) => string;
```

```ts
// Pick a pseudo-random item from an array
prng.randomItem<T>(seed: string, array: T[]) => T | undefined;
```

```ts
// Pick a pseudo-random property from an object
prng.randomObjectProperty(seed: string, object: object) => unknown | undefined
```

```ts
// Return a pseudo-random index from an array of weights
prng.randomIndex(seed: string, weights?: number[]) => number;
```

## PRNG Controllers

`BooleanController`

`SignController`

`FloatController`

`IntController`

`HexColorController`

`ItemController`

`ObjectPropertyController`

`WeightsController`

`BooleanGroupController`

`SignGroupController`

`FloatGroupController`

`IntGroupController`

`HexColorGroupController`

`ItemGroupController`

`ObjectPropertyGroupController`

`WeightsGroupController`

## License

MIT License, see [LICENSE](https://github.com/toosoon-dev/toosoon-lsystem/tree/master/LICENSE) for details
