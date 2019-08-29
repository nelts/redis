import WorkerFactory, { WorkerPlugin, WorkerServiceFrameworker } from '@nelts/worker';
import AgentFactory, { AgentPlugin } from '@nelts/agent';
import MasterFactory, { MasterPlugin } from '@nelts/master';
import { RedisOptions } from 'ioredis';
export interface LocalWorkerPlugin<T extends WorkerServiceFrameworker> extends WorkerPlugin<T> {
}
export interface LocalWorkerFactory<T extends WorkerServiceFrameworker> extends WorkerFactory<T> {
}
export interface LocalAgentPlugin extends AgentPlugin {
}
export interface LocalAgentFactory extends AgentFactory {
}
export interface LocalMasterFactory extends MasterFactory {
}
export interface LocalMasterPlugin extends MasterPlugin {
}
export declare function AutoBindRedis<T extends LocalWorkerPlugin<U>, U extends WorkerServiceFrameworker>(name: string, plu: T, options: RedisOptions): void;
