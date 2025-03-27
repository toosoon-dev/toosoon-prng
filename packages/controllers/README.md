# TOOSOON Pseudo-Random Number Generator (PRNG) — Controllers

This project provides a `PRNG` functions with a set of `Controllers` for generating and manipulating pseudo-random values using a seed-based approach and various algorithms.

It adds additionnal features to the main library: [toosoon-prng](https://github.com/toosoon-dev/toosoon-prng).

## Installation

Yarn:

```properties
$ yarn add toosoon-prng-controllers
```

NPM:

```properties
$ npm install toosoon-prng-controllers
```

## Usage

```ts
import { IntController, IntGroupController } from 'toosoon-prng-controllers';

const config = {
  count: new IntController('count', 0, 10),
  counts: new IntGroupController('counts', 5, 10)
};

console.log(config.count.getValue()); // Pseudo-random integer in the interval [0, 10]

for (let i = 0; i < 5; i++) {
  console.log(config.counts.getValueAt(i)); // Pseudo-random integers in the interval [5, 10]
}
```

## Controllers

### BooleanController

Generate pseudo-random boolean value.

```ts
class BooleanController(seed: string | number, probability?: number);
```

### SignController

Generate pseudo-random sign value (-1 or 1).

```ts
class SignController(seed: string | number, probability?: number);
```

### FloatController

Generate pseudo-random floating-point number within a specified range.

```ts
class FloatController(seed: string | number, min?: number, max?: number);
```

### IntController

Generate pseudo-random integer number within a specified range.

```ts
class IntController(seed: string | number, min: number, max: number);
```

### HexColorController

Generates pseudo-random hexadecimal color.

```ts
class HexColorController(seed: string);
```

### ItemController

Pick a pseudo-random item from a given array.

```ts
class ItemController<T>(seed: string | number, items: T[]);
```

### ObjectPropertyController

Pick a pseudo-random property value from a given object.

```ts
class ObjectPropertyController<T>(seed: string | number, object: Record<string, T>);
```

### WeightsController

Select a pseudo-random index from an array of weighted items.

```ts
class WeightsController<T>(seed: string | number, items: Array<{ weight: number; value: T }>);
```

### GaussianController

Generate a pseudo-random number fitting a Gaussian (normal) distribution.

```ts
class GaussianController(seed: string | number, mean?: number, spread?: number);
```

## Group Controllers

Group Controllers manage multiple instances of individual controllers.

### BooleanGroupController

Manage multiple [`BooleanController`](#booleancontroller).

```ts
class BooleanGroupController(seed: string | number, probability: number);
```

### SignGroupController

Manage multiple [`SignController`](#signcontroller).

```ts
class SignGroupController(seed: string | number, probability: number);
```

### FloatGroupController

Manage multiple [`FloatController`](#floatcontroller).

```ts
class FloatGroupController(seed: string | number, min: number, max: number);
```

### IntGroupController

Manage multiple [`IntController`](#intcontroller).

```ts
class IntGroupController(seed: string | number, min: number, max: number);
```

### HexColorGroupController

Manage multiple [`HexColorController`](#hexcolorcontroller).

```ts
class HexColorGroupController(seed: string);
```

### ItemGroupController

Manage multiple [`ItemController`](#itemcontroller).

```ts
class ItemGroupController<T>(seed: string | number, items: T[]);
```

### ObjectPropertyGroupController

Manage multiple [`ObjectPropertyController`](#objectpropertycontroller).

```ts
class ObjectPropertyGroupController<T>(seed: string | number, object: object);
```

### WeightsGroupController

Manage multiple [`WeightsController`](#weightscontroller).

```ts
class WeightsGroupController<T>(seed: string | number, items: Array<{ weight: number; value: T }>);
```

### GaussianGroupController

Manage multiple [`GaussianController`](#gaussiancontroller).

```ts
class GaussianGroupController<T>(seed: string | number, mean?: number, spread?: number);
```

## License

MIT License, see [LICENSE](https://github.com/toosoon-dev/toosoon-prng/tree/master/LICENSE) for details.
