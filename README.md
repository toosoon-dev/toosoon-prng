# TOOSOON PRNG

TOOSOON pseudo-random number generator utility functions & controllers.

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
console.log(prng.randomFloat('angle', 0, Math.PI)); // Pseudo-random number in the interval [0, PI]
```

PRNG Controllers:

```ts
import { FloatController, FloatGroupController } from 'toosoon-prng';

const config = {
  angle: new FloatController('angle', 0, Math.PI),
  angles: new FloatGroupController('angle', 0, Math.PI)
};

config.angle.addGui(gui, 0, Math.PI, 0.01);
config.angles.addGui(gui, 0, Math.PI, 0.01);

console.log(config.angle.getValue()); // Pseudo-random number in the interval [0, PI]

for (let i = 0; i < 5; i++) {
  console.log(config.angles.getValueAt(i)); // 5 Pseudo-random numbers in the interval [0, PI]
}
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

```ts
class BooleanController(seed: string, probability?: number);
```

```ts
class SignController(seed: string, probability?: number);
```

```ts
class FloatController(seed: string, min?: number, max?: number);
```

```ts
class IntController(seed: string, min: number, max: number);
```

```ts
class HexColorController(seed: string);
```

```ts
class ItemController<T>(seed: string, items: T[]);
```

```ts
class ObjectPropertyController<T>(seed: string, object: object);
```

```ts
class WeightsController<T>(seed: string, items: Array<{ weight: number; value: T }>);
```

```ts
class BooleanGroupController(seed: string, probability: number);
```

```ts
class SignGroupController(seed: string, probability: number);
```

```ts
class FloatGroupController(seed: string, min: number, max: number);
```

```ts
class IntGroupController(seed: string, min: number, max: number);
```

```ts
class HexColorGroupController(seed: string);
```

```ts
class ItemGroupController<T>(seed: string, items: T[]);
```

```ts
class ObjectPropertyGroupController<T>(seed: string, object: object);
```

```ts
class WeightsGroupController<T>(seed: string, items: Array<{ weight: number; value: T }>);
```

## License

MIT License, see [LICENSE](https://github.com/toosoon-dev/toosoon-prng/tree/master/LICENSE) for details
