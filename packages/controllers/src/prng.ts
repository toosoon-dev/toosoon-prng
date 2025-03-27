import { type AlgorithmFunction, type AlgorithmName, PRNG as BasePRNG } from 'toosoon-prng';

import { type PRNGController } from './controllers';

/**
 * Utility class for generating pseudo-random values and managing PRNG Controllers
 *
 * @exports
 * @class PRNG
 * @extends BasePRNG
 */
export class PRNG extends BasePRNG {
  public controllers: PRNGController[] = [];

  set seed(seed: string | number) {
    if (this._seed === `${seed}`) return;
    this._seed = `${seed}`;
    this.controllers.forEach((controller) => controller.getValue());
  }

  set algorithm(algorithm: AlgorithmFunction) {
    if (this._algorithm === algorithm) return;
    this._algorithm = algorithm;
    this.controllers.forEach((controller) => controller.getValue());
  }

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
   * @param {string|number} seed
   */
  public setSeed(seed: string | number): void {
    if (this.seed === `${seed}`) return;
    super.setSeed(seed);
    this.controllers.forEach((controller) => controller.getValue());
  }

  /**
   * Set this PRNG algorithm
   *
   * @param {AlgorithmName} algorithmName Algorithm name
   */
  public setAlgorithm(algorithmName: AlgorithmName): void {
    if (this.algorithm === this.getAlgorithmByName(algorithmName)) return;
    super.setAlgorithm(algorithmName);
    this.controllers.forEach((controller) => controller.getValue());
  }
}

const prng = new PRNG();

export default prng;
