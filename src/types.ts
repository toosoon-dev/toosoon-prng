export enum AlgorithmName {
  jsf32 = 'jsf32',
  mulberry32 = 'mulberry32',
  sfc32 = 'sfc32',
  splitmix32 = 'splitmix32',
  xoshiro128ss = 'xoshiro128**'
}

export type AlgorithmFunction = (...args: number[]) => number;
