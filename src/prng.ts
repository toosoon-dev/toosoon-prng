import { cyrb128, jsf32, mulberry32, sfc32, splitmix32, xoshiro128ss } from 'toosoon-utils/prng';
import { AlgorithmFunction, AlgorithmName } from './types';

/**
 * Utility class for generating pseudo-random values
 *
 * @class PRNG
 * @exports
 */
export class PRNG {
  protected _seed: string = '';
  protected _algorithm: AlgorithmFunction = splitmix32;

  get seed() {
    return this._seed;
  }

  set seed(seed: string | number) {
    this._seed = `${seed}`;
  }

  get algorithm() {
    return this._algorithm;
  }

  set algorithm(algorithm: AlgorithmFunction) {
    this._algorithm = algorithm;
  }

  /**
   * Set this PRNG seed
   *
   * @param {string|number} seed
   */
  public setSeed(seed: string | number): void {
    this.seed = `${seed}`;
  }

  /**
   * Set this PRNG algorithm
   *
   * @param {AlgorithmName} algorithmName Algorithm name
   */
  public setAlgorithm(algorithmName: AlgorithmName): void {
    this.algorithm = this.getAlgorithmByName(algorithmName);
  }

  /**
   * Generate a pseudo-random number in the interval [0, 1]
   * PRNG equivalent of `Math.random()`
   *
   * @param {string|number} seed
   * @returns {number}
   */
  public random(seed: string | number): number {
    const hashes = cyrb128(this.seed + `${seed}`);
    return this.algorithm(...hashes);
  }

  /**
   * Generate a pseudo-random boolean (true or false)
   *
   * @param {string|number} seed
   * @param {number} [probability=0.5] Probability to get `true`
   * @returns {boolean} Either `true` or `false`
   */
  public randomBoolean(seed: string | number, probability: number = 0.5): boolean {
    return this.random(seed) < probability;
  }

  /**
   * Generate a pseudo-random sign (1 or -1)
   *
   * @param {string|number} seed
   * @param {number} [probability=0.5] Probability to get 1
   * @returns {number} Either 1 or -1
   */
  public randomSign(seed: string | number, probability: number = 0.5): number {
    return this.randomBoolean(seed, probability) ? 1 : -1;
  }

  /**
   * Generate a pseudo-random floating-point number within a specified range
   *
   * @param {string|number} seed
   * @param {number} [min=0]       Minimum boundary
   * @param {number} [max=1]       Maximum boundary
   * @param {number} [precision=2] Number of digits after the decimal point
   * @returns {number} Generated float
   */
  public randomFloat(seed: string | number, min: number = 0, max: number = 1, precision: number = 2): number {
    return parseFloat(Math.min(min + this.random(seed) * (max - min), max).toFixed(precision));
  }

  /**
   * Generate a pseudo-random integer number within a specified range
   *
   * @param {string|number} seed
   * @param {number} min Minimum boundary
   * @param {number} max Maximum boundary
   * @returns {number} Generated integer
   */
  public randomInt(seed: string | number, min: number, max: number): number {
    return Math.floor(this.random(seed) * (max - min + 1) + min);
  }

  /**
   * Generate a pseudo-random hexadecimal color
   *
   * @param {string|number} seed
   * @returns {string} Generated hexadecimal color
   */
  public randomHexColor(seed: string | number): string {
    return '#' + ('00000' + ((this.random(seed) * (1 << 24)) | 0).toString(16)).slice(-6);
  }

  /**
   * Pick a pseudo-random item from a given array
   *
   * @param {string|number} seed
   * @param {T[]} array Array to pick the item from
   * @returns {T|undefined} Random item picked
   */
  public randomItem<T = unknown>(seed: string | number, array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.randomInt(seed, 0, array.length - 1)];
  }

  /**
   * Pick a pseudo-random property value from a given object
   *
   * @param {string|number} seed
   * @param {object} object Object to pick the property from
   * @returns {T|undefined} Random item picked
   */
  public randomObjectProperty<T = unknown>(seed: string | number, object: Record<string, T>): T | undefined {
    const keys = Object.keys(object);
    const key = this.randomItem(seed, keys);
    if (key && object.hasOwnProperty(key)) {
      return object[key as keyof object];
    }
  }

  /**
   * Select a pseudo-random index from an array of weighted items
   *
   * @param {string|number} seed
   * @param {number[]} weights Array of weights
   * @returns {number} Random index based on weights
   */
  public randomIndex(seed: string | number, weights: number[]): number {
    if (weights.length === 0) return -1;

    let totalWeight = 0;
    for (let weight of weights) {
      totalWeight += weight;
    }

    if (totalWeight <= 0) console.warn('PRNG.randomIndex()', 'Weights must sum to > 0', totalWeight);

    let weight = this.random(seed) * totalWeight;
    for (let i = 0; i < weights.length; i++) {
      if (weight < weights[i]) return i;
      weight -= weights[i];
    }

    return 0;
  }

  /**
   * Generate a pseudo-random number fitting a Gaussian (normal) distribution
   *
   * @param {string|number} seed
   * @param {number} [mean=0]   Central value
   * @param {number} [spread=1] Standard deviation
   * @returns Generated number
   */
  public randomGaussian(seed: string | number, mean: number = 0, spread: number = 1): number {
    const hashes = cyrb128(this.seed + `${seed}`);
    const u = this.algorithm(hashes[0] + hashes[1]);
    const v = this.algorithm(hashes[2] + hashes[3]);
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * spread;
  }

  /**
   * Get the PRNG algorithm function by its name
   *
   * @param {AlgorithmName} algorithmName Algorithm name
   * @returns {Function} PRNG algorithm function
   */
  protected getAlgorithmByName(algorithmName: AlgorithmName): (...args: number[]) => number {
    switch (algorithmName) {
      case AlgorithmName.jsf32:
        return jsf32;
      case AlgorithmName.mulberry32:
        return mulberry32;
      case AlgorithmName.sfc32:
        return sfc32;
      case AlgorithmName.splitmix32:
        return splitmix32;
      case AlgorithmName.xoshiro128ss:
        return xoshiro128ss;
    }
  }
}

const prng = new PRNG();

export default prng;
