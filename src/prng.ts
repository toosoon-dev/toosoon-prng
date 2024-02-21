import { PRNGController } from './controllers';
import { cyrb128, jsf32, mulberry32, sfc32, xoshiro128ss } from './utils';

export enum PRNGMethod {
  jsf32 = 'jsf32',
  mulberry32 = 'mulberry32',
  sfc32 = 'sfc32',
  xoshiro128ss = 'xoshiro128**'
}

/**
 * PRNG class
 *
 * @class PRNG
 */
class PRNG {
  public seed: string = '';
  public method: PRNGMethod = PRNGMethod.sfc32;
  public controllers: PRNGController[] = [];

  /**
   * Add a controller to this PRNG
   *
   * @param {PRNGController} controller
   */
  public addController(controller: PRNGController): void {
    this.controllers.push(controller);
  }

  /**
   * Remove a controller from this PRNG
   *
   * @param {PRNGController} controller
   */
  public removeController(controller: PRNGController): void {
    const index = this.controllers.indexOf(controller);
    this.controllers.splice(index, 1);
  }

  /**
   * Set this PRNG seed
   *
   * @param {string} seed
   */
  public setSeed(seed: string): void {
    if (this.seed === seed) return;
    this.seed = seed;
    this.controllers.forEach((controller) => controller.getValue());
  }

  /**
   * Set the PRNG method for generating pseudo-random values
   *
   * @param {PRNGMethod} method PRNG method name
   */
  public setMethod(method: PRNGMethod): void {
    this.method = method;
  }

  /**
   * Generate a pseudo-random number in the interval [0, 1]
   * PRNG equivalent of `Math.random()`
   *
   * @param {string} seed
   * @returns {number}
   */
  public random(seed: string): number {
    const hashes = cyrb128(this.seed + seed);
    switch (this.method) {
      case PRNGMethod.jsf32:
        return jsf32(hashes[0], hashes[1], hashes[2], hashes[3]);
      case PRNGMethod.mulberry32:
        return mulberry32(hashes[0]);
      case PRNGMethod.sfc32:
        return sfc32(hashes[0], hashes[1], hashes[2], hashes[3]);
      case PRNGMethod.xoshiro128ss:
        return xoshiro128ss(hashes[0], hashes[1], hashes[2], hashes[3]);
    }
  }

  /**
   * Generate a pseudo-random boolean (true or false)
   *
   * @param {string} seed
   * @param {number} [probability=0.5] Probability to get `true`
   * @returns {boolean} Either `true` or `false`
   */
  public randomBoolean(seed: string, probability: number = 0.5): boolean {
    return this.random(seed) < probability;
  }

  /**
   * Generate a pseudo-random sign (1 or -1)
   *
   * @param {string} seed
   * @param {number} [probability=0.5] Probability to get 1
   * @returns {number} Either 1 or -1
   */
  public randomSign(seed: string, probability: number = 0.5): number {
    return this.randomBoolean(seed, probability) ? 1 : -1;
  }

  /**
   * Generate a pseudo-random floating-point number within a specified range
   *
   * @param {string} seed
   * @param {number} [min=0]       Minimum boundary
   * @param {number} [max=1]       Maximum boundary
   * @param {number} [precision=2] Number of digits after the decimal point
   * @returns {number} Generated float
   */
  public randomFloat(seed: string, min: number = 0, max: number = 1, precision: number = 2): number {
    return parseFloat(Math.min(min + this.random(seed) * (max - min), max).toFixed(precision));
  }

  /**
   * Generate a pseudo-random integer number within a specified range
   *
   * @param {string} seed
   * @param {number} min Minimum boundary
   * @param {number} max Maximum boundary
   * @returns {number} Generated integer
   */
  public randomInt(seed: string, min: number, max: number): number {
    return Math.floor(this.random(seed) * (max - min + 1) + min);
  }

  /**
   * Generate a pseudo-random hexadecimal color
   *
   * @param {string} seed
   * @returns {string} Generated hexadecimal color
   */
  public randomHexColor(seed: string): string {
    return '#' + ('00000' + ((this.random(seed) * (1 << 24)) | 0).toString(16)).slice(-6);
  }

  /**
   * Pick a pseudo-random item from a given array
   *
   * @param {string} seed
   * @param {T[]} array Array to pick the item from
   * @returns {T|undefined} Random item picked
   */
  public randomItem<T = unknown>(seed: string, array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.randomInt(seed, 0, array.length - 1)];
  }

  /**
   * Pick a pseudo-random property value from a given object
   *
   * @param {string} seed
   * @param {object} object Object to pick the property from
   * @returns {T|undefined} Random item picked
   */
  public randomObjectProperty<T = unknown>(seed: string, object: { [key: string]: T }): T | undefined {
    const keys = Object.keys(object);
    const key = this.randomItem(seed, keys);
    if (key && object.hasOwnProperty(key)) {
      return object[key as keyof object];
    }
  }

  /**
   * Select a pseudo-random index from an array of weighted items
   *
   * @param {string} seed
   * @param {number[]} weights Array of weights
   * @returns {number} Random index based on weights
   */
  public randomIndex(seed: string, weights: number[]): number {
    if (weights.length === 0) return -1;

    let totalWeight = 0;
    for (let weight of weights) {
      totalWeight += weight;
    }

    if (totalWeight <= 0) console.warn('PRNG.randomIndex()', 'Weights must sum to > 0', totalWeight);

    let random = this.random(seed) * totalWeight;
    for (let i = 0; i < weights.length; i++) {
      if (random < weights[i]) return i;
      random -= weights[i];
    }

    return 0;
  }
}

const prng = new PRNG();

export default prng;
