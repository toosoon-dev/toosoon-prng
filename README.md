# TOOSOON Pseudo-Random Number Generator (PRNG)

This project provides a `PRNG` instance and a set of `Controllers` for generating pseudo-random values using a seed-based approach and various algorithms. These controllers are particularly useful for applications requiring deterministic randomization, such as procedural generation or simulations.

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

##### PRNG

```ts
import prng from 'toosoon-prng';

prng.setSeed('seed');
console.log(prng.randomFloat('angle', 0, Math.PI)); // Pseudo-random number in the interval [0, PI]
```

##### PRNG Controllers

```ts
import { IntController, IntGroupController } from 'toosoon-prng';

const config = {
  count: new IntController('count', 0, Math.PI),
  counts: new IntGroupController('counts', 0, Math.PI)
};

config.count.addGUI(gui, 0, 10);
config.counts.addGUI(gui, 5, 10);

console.log(config.count.getValue()); // Pseudo-random integer in the interval [0, 10]

for (let i = 0; i < 5; i++) {
  console.log(config.counts.getValueAt(i)); // Pseudo-random integers in the interval [5, 10]
}
```

## PRNG Functions

All PRNG functions have a `seed` argument wich allows you to add a sub-seed string to the `PRNG` instance global `seed` in order to get different pseudo-random outputs while using a PRNG function multiple times.

```ts
prng.setSeed('global-seed');
console.log(prng.randomBoolean('1')); // Could be true or false
console.log(prng.randomBoolean('2')); // Could be different from the first pseudo-random value
```

##### setSeed(seed)

Set the `PRNG` instance seed.

- `seed`

```ts
prng.setSeed(seed: string): void;
```

##### setAlgorithm(algorithm)

Set the `PRNG` algorithm for generating pseudo-random values.

- `algorithm`: Algorithm name.

```ts
prng.setAlgorithm(algorithm: Algorithm): void;
```

##### random(seed)

Generate a pseudo-random number in the interval [0, 1]. PRNG equivalent of `Math.random()`.

- `seed`

```ts
prng.random(seed: string): number;
```

##### randomBoolean(seed)

Generate a pseudo-random boolean (true or false).

- `seed`
- `[probability=0.5]`: Probability to get `true`.

```ts
prng.randomBoolean(seed: string, probability?: number): boolean;
```

##### randomSign(seed)

Generate a pseudo-random sign (1 or -1).

- `seed`
- `[probability=0.5]`: Probability to get 1.

```ts
prng.randomSign(seed: string, probability?: number): number;
```

##### randomFloat(seed, min, max)

Generate pseudo-random a floating-point number within a specified range.

- `seed`
- `[min=0]`: Minimum boundary.
- `[max=1]`: Maximum boundary.
- `[precison=2]`: Number of digits after the decimal point.

```ts
prng.randomFloat(seed: string, min?: number, max?: number1, precision?: number): number;
```

##### randomInt(seed, min, max)

Generate pseudo-random integer number within a specified range.

- `seed`
- `min`: Minimum boundary.
- `max`: Maximum boundary.

```ts
prng.randomInt(seed: string, min: number, max: number): void;
```

##### randomHexColor(seed)

Generate a pseudo-random hexadecimal color.

- `seed`

```ts
prng.randomHexColor(seed: string): string;
```

##### randomItem(seed0 array)

Pick a pseudo-random item from a given array.

- `seed`
- `array`: Array to pick the item from.

```ts
prng.randomItem<T>(seed: string, array: T[]): T | undefined;
```

##### randomObjectProperty(seed, object)

Pick a pseudo-random property value from a given object.

- `seed`
- `object`: Object to pick the property from.

```ts
prng.randomObjectProperty<T>(seed: string, object: object): T | undefined;
```

##### randomIndex(seed, weights)

Select a pseudo-random index from an array of weighted items.

- `seed`
- `weights`: Array of weights

```ts
prng.randomIndex(seed: string, weights: number[]): number;
```

## Controllers

### BooleanController

Generate pseudo-random boolean values.

```ts
class BooleanController(seed: string, probability?: number);
```

### SignController

Generate pseudo-random sign values (-1 or 1).

```ts
class SignController(seed: string, probability?: number);
```

### FloatController

Generate pseudo-random floating-point numbers within a specified range.

```ts
class FloatController(seed: string, min?: number, max?: number);
```

### IntController

```ts
class IntController(seed: string, min: number, max: number);
```

### HexColorController

Generates pseudo-random hexadecimal color.

```ts
class HexColorController(seed: string);
```

### ItemController

Pick a pseudo-random item from a given array.

```ts
class ItemController<T>(seed: string, items: T[]);
```

### ObjectPropertyController

Pick a pseudo-random property value from a given object.

```ts
class ObjectPropertyController<T>(seed: string, object: object);
```

### WeightsController

Select a pseudo-random index from an array of weighted items.

```ts
class WeightsController<T>(seed: string, items: Array<{ weight: number; value: T }>);
```

## Group Controllers

Group Controllers manage multiple instances of individual controllers.

### BooleanGroupController

Manage multiple [`BooleanController`](###booleancontroller).

```ts
class BooleanGroupController(seed: string, probability: number);
```

### SignGroupController

Manage multiple [`SignController`](###signcontroller).

```ts
class SignGroupController(seed: string, probability: number);
```

### FloatGroupController

Manage multiple [`FloatController`](###floatcontroller).

```ts
class FloatGroupController(seed: string, min: number, max: number);
```

### IntGroupController

Manage multiple [`IntController`](#intcontroller).

```ts
class IntGroupController(seed: string, min: number, max: number);
```

### HexColorGroupController

Manage multiple [`HexColorController`](#hexcolorcontroller).

```ts
class HexColorGroupController(seed: string);
```

### ItemGroupController

Manage multiple [`ItemController`](#itemcontroller).

```ts
class ItemGroupController<T>(seed: string, items: T[]);
```

### ObjectPropertyGroupController

Manage multiple [`ObjectPropertyController`](#objectpropertycontroller).

```ts
class ObjectPropertyGroupController<T>(seed: string, object: object);
```

### WeightsGroupController

Manage multiple [`WeightsController`](#weightscontroller).

```ts
class WeightsGroupController<T>(seed: string, items: Array<{ weight: number; value: T }>);
```

## Algorithms

By default, the library is using `SplitMix32` algorithm for generating the pseudo-random values but it is possible to change the algorithm used by one of the following:

- `jsf32`: Jenkins' Small Fast, Generator with a 32-bit state.
- `mulberry32`: Mulberry32, Generator with a 32-bit state.
- `sfc32`: Simple Fast Counter, Generator with a 128-bit state.
- `splitmix32`: SplitMix32, Generator with a 32-bit state.
- `xoshiro128ss`: xoshiro128\*\*, Generator with a 128-bit state.

**Credits**: [Seeding random number generator in Javascript](https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript)

```ts
import prng, { Algorithm } from 'toosoon-prng';

prng.setAlgorithm(Algorithm.sfc32);
```

## License

MIT License, see [LICENSE](https://github.com/toosoon-dev/toosoon-prng/tree/master/LICENSE) for details
