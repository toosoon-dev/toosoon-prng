# TOOSOON Pseudo-Random Number Generator (PRNG)

This project provides PRNG functions for generating pseudo-random values using a seed-based approach and various algorithms. These are particularly useful for applications requiring deterministic randomization, such as procedural generation or simulations.

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

```ts
import prng from 'toosoon-prng';

prng.setSeed('seed');
console.log(prng.randomFloat('angle', 0, Math.PI)); // Pseudo-random number in the interval [0, PI]
```

## PRNG Functions

All PRNG functions have a `seed` parameter wich allows you to add a sub-seed string to the `PRNG` instance global `seed` in order to get different pseudo-random values while using a PRNG function multiple times.

```ts
prng.setSeed('global-seed');
console.log(prng.randomBoolean('one')); // Could be true or false
console.log(prng.randomBoolean('two')); // Could be different from the first pseudo-random value
```

##### setSeed(seed)

Set the `PRNG` instance seed.

- `seed`

```ts
prng.setSeed(seed: string | number): void;
```

##### setAlgorithm(algorithmName)

Set the `PRNG` algorithm for generating pseudo-random values.

- `algorithmName`: Algorithm name.

```ts
prng.setAlgorithm(algorithmName: AlgorithmName): void;
```

##### random(seed)

Generate a pseudo-random number in the interval [0, 1]. PRNG equivalent of `Math.random()`.

- `seed`

```ts
prng.random(seed: string | number): number;
```

##### randomBoolean(seed)

Generate a pseudo-random boolean (true or false).

- `seed`
- `[probability=0.5]`: Probability to get true.

```ts
prng.randomBoolean(seed: string | number, probability?: number): boolean;
```

##### randomSign(seed)

Generate a pseudo-random sign (1 or -1).

- `seed`
- `[probability=0.5]`: Probability to get 1.

```ts
prng.randomSign(seed: string | number, probability?: number): number;
```

##### randomFloat(seed, min, max)

Generate pseudo-random a floating-point number within a specified range.

- `seed`
- `[min=0]`: Minimum boundary.
- `[max=1]`: Maximum boundary.
- `[precison=2]`: Number of digits after the decimal point.

```ts
prng.randomFloat(seed: string | number, min?: number, max?: number1, precision?: number): number;
```

##### randomInt(seed, min, max)

Generate pseudo-random integer number within a specified range.

- `seed`
- `min`: Minimum boundary.
- `max`: Maximum boundary.

```ts
prng.randomInt(seed: string | number, min: number, max: number): void;
```

##### randomHexColor(seed)

Generate a pseudo-random hexadecimal color.

- `seed`

```ts
prng.randomHexColor(seed: string | number): string;
```

##### randomItem(seed0 array)

Pick a pseudo-random item from a given array.

- `seed`
- `array`: Array to pick the item from.

```ts
prng.randomItem<T>(seed: string | number, array: T[]): T | undefined;
```

##### randomObjectProperty(seed, object)

Pick a pseudo-random property value from a given object.

- `seed`
- `object`: Object to pick the property from.

```ts
prng.randomObjectProperty<T>(seed: string | number, object: Record<string, T>): T | undefined;
```

##### randomIndex(seed, weights)

Select a pseudo-random index from an array of weighted items.

- `seed`
- `weights`: Array of weights

```ts
prng.randomIndex(seed: string | number, weights: number[]): number;
```

##### randomGaussian(seed, mean, spread)

Generate a pseudo-random number fitting a Gaussian (normal) distribution.

`seed`
`[mean=0]`: Central value.
`[spread=1]`: Standard deviation.

```ts
prng.randomGaussian(seed: string | number, mean?: number, spread?: number): number;
```

## Algorithms

By default, the library is using _SplitMix32_ algorithm for generating the pseudo-random values but it is possible to change the algorithm used by one of the following:

- `jsf32`: _Jenkins' Small Fast_, Generator with a 32-bit state.
- `mulberry32`: _Mulberry32_, Generator with a 32-bit state.
- `sfc32`: _Simple Fast Counter_, Generator with a 128-bit state.
- `splitmix32`: _SplitMix32_, Generator with a 32-bit state.
- `xoshiro128ss`: _xoshiro128\*\*_, Generator with a 128-bit state.

```ts
import prng, { Algorithm } from 'toosoon-prng';

// Set 'Simple Fast Counter' as the PRNG instance algorithm
prng.setAlgorithm(Algorithm.sfc32);
```

## License

MIT License, see [LICENSE](https://github.com/toosoon-dev/toosoon-prng/tree/master/LICENSE) for details.
