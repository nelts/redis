import * as ioredis from 'ioredis';
const commands = require('redis-commands');
export default class Redis {
  private readonly redis: ioredis.Redis;
  private useTransacte: boolean = false;
  private pools: ({ cmd: string, args: any[] })[] = [];
  private transacteValues: { [name: string]: any } = {};
  constructor(redis: ioredis.Redis) {
    this.redis = redis;
  }

  begin() {
    if (this.useTransacte) return;
    this.pools = [];
    this.transacteValues = {};
    this.useTransacte = true;
    return this;
  }

  async commit() {
    if (!this.useTransacte) return;
    const pools = this.pools.slice(0);
    this.pools = [];
    for (let i = 0; i < pools.length; i++) {
      const cmd = pools[i].cmd;
      const args = pools[i].args;
      await this.execute(cmd, args);
    }
    this.transacteValues = {};
    this.useTransacte = false;
    return this;
  }

  async rollback() {
    if (!this.useTransacte) return;
    this.pools = [];
    this.transacteValues = {};
    this.useTransacte = false;
  }

  private async execute(cmd: string, args: any[]) {
    return await (<any>this.redis)[cmd](...args);
  }

  async get(name: string) {
    if (this.useTransacte) {
      if (this.transacteValues[name]) return this.transacteValues[name];
    }
    return await this.redis.get(name);
  }

  async set(name: string, value: any) {
    if (this.useTransacte) {
      this.pools.push({
        cmd: 'set',
        args: [name, value]
      });
      this.transacteValues[name] = value;
    } else {
      await this.redis.set(name, value);
    }
  }

  async hmset(name: string, value: any) {
    if (this.useTransacte) {
      this.pools.push({
        cmd: 'hmset',
        args: [name, value]
      });
      this.transacteValues[name] = value;
    } else {
      await this.redis.hmset(name, value);
    }
  }

  async hgetall(name: string) {
    if (this.useTransacte) {
      if (this.transacteValues[name]) return this.transacteValues[name];
    }
    return await this.redis.hgetall(name);
  }

  async del(name: string) {
    if (this.useTransacte) {
      this.pools.push({
        cmd: 'del',
        args: [name]
      });
      if (this.transacteValues[name]) Reflect.deleteProperty(this.transacteValues, name);
      return;
    }
    return await this.redis.del(name);
  }

  async expire(name: string, time: number) {
    if (this.useTransacte) {
      return this.pools.push({
        cmd: 'expire',
        args: [name, time]
      })
    }
    return await this.redis.expire(name, time);
  }

  async exists(name: string) {
    if (this.useTransacte) {
      if (this.transacteValues[name]) return 1;
    }
    return await this.redis.exists(name);
  }
}