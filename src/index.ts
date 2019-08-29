import WorkerFactory, { WorkerPlugin, WorkerServiceFrameworker } from '@nelts/worker';
import AgentFactory, { AgentPlugin } from '@nelts/agent';
import MasterFactory, { MasterPlugin } from '@nelts/master';
import * as ioredis from 'ioredis';
import Redis from './redis';

// worker interfaces
export interface LocalWorkerPlugin<T extends WorkerServiceFrameworker> extends WorkerPlugin<T> {}
export interface LocalWorkerFactory<T extends WorkerServiceFrameworker> extends WorkerFactory<T> {}

// agent interfaces
export interface LocalAgentPlugin extends AgentPlugin {}
export interface LocalAgentFactory extends AgentFactory {}

// master interfaces
export interface LocalMasterFactory extends MasterFactory {}
export interface LocalMasterPlugin extends MasterPlugin {}

export {
  Redis
}

export function AutoBindRedis<T extends LocalWorkerPlugin<U>, U extends WorkerServiceFrameworker>(
  name: string,
  plu: T, 
  options: ioredis.RedisOptions
) {
  const app = plu.app as LocalWorkerFactory<U>;
  const redis = new ioredis(options);
  app.on('ContextStart', async (ctx: any) => {
    ctx[name] = new Redis(redis);
    ctx.on('ContextResolve', async () => await ctx[name].commit());
  });
}