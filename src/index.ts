import WorkerFactory, { WorkerPlugin, WorkerServiceFrameworker } from '@nelts/worker';
import AgentFactory, { AgentPlugin } from '@nelts/agent';
import MasterFactory, { MasterPlugin } from '@nelts/master';
import { RedisOptions } from 'ioredis';
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

export function AutoBindRedis<T extends LocalWorkerPlugin<U>, U extends WorkerServiceFrameworker>(
  name: string,
  plu: T, 
  options: RedisOptions
) {
  const app = plu.app as LocalWorkerFactory<U>;
  const redis = new Redis(options);
  app.on('ContextStart', async (ctx: any) => {
    ctx[name] = redis;
    ctx.on('ContextResolve', async () => await ctx[name].commit());
  });
}