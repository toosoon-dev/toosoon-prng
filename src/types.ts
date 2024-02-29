export type { PRNGController, PRNGGroupController } from './controllers';

export enum Algorithm {
  jsf32 = 'jsf32',
  mulberry32 = 'mulberry32',
  sfc32 = 'sfc32',
  splitmix32 = 'splitmix32', // Default
  xoshiro128ss = 'xoshiro128**'
}
