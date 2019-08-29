import * as ioredis from 'ioredis';
const commands = require('redis-commands');
export default class Redis {
  private readonly redis: ioredis.Redis;
  private useTransacte: boolean = false;
  private transacte: ioredis.Pipeline = null;
  constructor(redis: ioredis.Redis) {
    this.redis = redis;
  }

  begin() {
    if (this.useTransacte) return;
    this.transacte = this.redis.multi();
    this.useTransacte = true;
    return this;
  }

  async commit() {
    if (this.useTransacte) return;
    await this.transacte.exec();
    this.useTransacte = false;
    this.transacte = null;
    return this;
  }

  async exec(cmd: string, ...args: any[]) {
    if (!commands.exists[cmd]) throw new Error('redis cannot find the command of ' + cmd);
    if (cmd && this.useTransacte && commands.hasFlag(cmd, 'write')) return await (<any>this.transacte)[cmd](...args);
    return await (<any>this.redis)[cmd](...args);
  }

  get(name: string) {
    return this.exec('get', name);
  }

  set(name: string, value: any) {
    return this.exec('set', name, value);
  }

  hmset(name: string, value: any) {
    return this.exec('hmset', name, value);
  }

  hgetall(name: string) {
    return this.exec('hmset', name);
  }

  del(name: string) {
    return this.exec('del', name);
  }

  expire(name: string, time: number) {
    return this.exec('expire', name, time);
  }
}