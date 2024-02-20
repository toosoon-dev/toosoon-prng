# TOOSOON PRNG (Pseudo-Random Number Generator)

TOOSOON pseudo-random number generator utility functions & controllers.

This project provides a `prng` instance and a set of `Controllers` for generating pseudo-random values using a seed-based approach and various algorithms. These controllers are particularly useful for applications requiring deterministic randomization, such as procedural generation or simulations.

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

prng.setSeed('010101');
console.log(prng.randomFloat('angle', 0, Math.PI)); // Pseudo-random number in the interval [0, PI]
```

##### PRNG Controllers

```ts
import { FloatController, FloatGroupController } from 'toosoon-prng';

const config = {
  angle: new FloatController('angle', 0, Math.PI),
  angles: new FloatGroupController('angle', 0, Math.PI)
};

config.angle.addGui(gui, 0, PI, 0.01);
config.angles.addGui(gui, 0, TAU, 0.01);

console.log(config.angle.getValue()); // Pseudo-random number in the interval [0, PI]

for (let i = 0; i < 5; i++) {
  console.log(config.angles.getValueAt(i)); // Pseudo-random numbers in the interval [0, TAU]
}
```

## PRNG Methods

Set the PRNG instance seed.

```ts
prng.setSeed(seed: string) => void;
```

Set the PRNG instance method for generating pseudo-random values.

```ts
prng.setMethod(method: PRNGMethod) => void;
```

Generate a pseudo-random number in the interval [0, 1] (PRNG equivalent of Math.random).

```ts
prng.random(seed: string) => number;
```

Generate a pseudo-random boolean (true or false).

```ts
prng.randomBoolean(seed: string, probability?: number) => boolean;
```

Generate a pseudo-random sign (1 or -1).

```ts
prng.randomSign(seed: string, probability?: number) => number;
```

Generate pseudo-random floating-point numbers within a specified range.

```ts
prng.randomFloat(seed: string, min?: number, max?: number1, precision?: number) => number;
```

Generate pseudo-random integer numbers within a specified range.

```ts
prng.randomInt(seed: string, min: number, max: number) => void;
```

Generate a pseudo-random hexadecimal color.

```ts
prng.randomHexColor(seed: string) => string;
```

Pick a pseudo-random item from a given array.

```ts
prng.randomItem<T>(seed: string, array: T[]) => T | undefined;
```

Pick a pseudo-random property value from a given object.

```ts
prng.randomObjectProperty(seed: string, object: object) => unknown | undefined
```

Select a pseudo-random index from an array of weighted items.

```ts
prng.randomIndex(seed: string, weights?: number[]) => number;
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

Manage multiple [`IntController`](###intcontroller).

```ts
class IntGroupController(seed: string, min: number, max: number);
```

### HexColorGroupController

Manage multiple [`HexColorController`](###hexcolorcontroller).

```ts
class HexColorGroupController(seed: string);
```

### ItemGroupController

Manage multiple [`ItemController`](###itemcontroller).

```ts
class ItemGroupController<T>(seed: string, items: T[]);
```

### ObjectPropertyGroupController

Manage multiple [`ObjectPropertyController`](###objectpropertycontroller).

```ts
class ObjectPropertyGroupController<T>(seed: string, object: object);
```

### WeightsGroupController

Manage multiple [`WeightsController`](###weightscontroller).

```ts
class WeightsGroupController<T>(seed: string, items: Array<{ weight: number; value: T }>);
```

## License

MIT License, see [LICENSE](https://github.com/toosoon-dev/toosoon-prng/tree/master/LICENSE) for details
