import { PRNGController } from './controllers';
import { cyrb128, jsf32, mulberry32, sfc32, xoshiro128ss } from './utils';

export enum PRNGMethod {
  jsf32 = 'jsf32',
  mulberry32 = 'mulberry32',
  sfc32 = 'sfc32',
  xoshiro128ss = 'xoshiro128**'
}

class PRNG {
  public seed: string = '';
  public method: PRNGMethod = PRNGMethod.sfc32;
  public controllers: PRNGController[] = [];

  constructor(seed: string = '') {
    this.setSeed(seed);
  }

  public addController(controller: PRNGController) {
    this.controllers.push(controller);
  }

  public removeController(controller: PRNGController) {
    const index = this.controllers.indexOf(controller);
    this.controllers.splice(index, 1);
  }

  public setSeed(seed: string) {
    if (this.seed === seed) return;
    this.seed = seed;
    this.controllers.forEach((controller) => controller.getValue());
  }

  public setMethod(method: PRNGMethod) {
    this.method = method;
  }

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

  public randomBoolean(seed: string, probability: number = 0.5): boolean {
    return this.random(seed) < probability;
  }

  public randomSign(seed: string, probability: number = 0.5): number {
    return this.randomBoolean(seed, probability) ? 1 : -1;
  }

  public randomFloat(seed: string, min: number = 0, max: number = 1, precision: number = 2): number {
    return parseFloat(Math.min(min + this.random(seed) * (max - min), max).toFixed(precision));
  }

  public randomInt(seed: string, min: number, max: number) {
    return Math.floor(this.random(seed) * (max - min + 1) + min);
  }

  public randomHexColor(seed: string): string {
    return '#' + ('00000' + ((this.random(seed) * (1 << 24)) | 0).toString(16)).slice(-6);
  }

  public randomItem<T = unknown>(seed: string, array: T[] = []): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.randomInt(seed, 0, array.length - 1)];
  }

  public randomObjectProperty(seed: string, object: object): unknown | undefined {
    const keys = Object.keys(object);
    const key = this.randomItem(seed, keys);
    if (key && object.hasOwnProperty(key)) {
      return object[key as keyof object];
    }
  }

  public randomIndex(seed: string, weights: number[] = []): number {
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
