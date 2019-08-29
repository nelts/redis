"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commands = require('redis-commands');
class Redis {
    constructor(redis) {
        this.useTransacte = false;
        this.transacte = null;
        this.redis = redis;
    }
    begin() {
        if (this.useTransacte)
            return;
        this.transacte = this.redis.multi();
        this.useTransacte = true;
        return this;
    }
    async commit() {
        if (this.useTransacte)
            return;
        await this.transacte.exec();
        this.useTransacte = false;
        this.transacte = null;
        return this;
    }
    async exec(cmd, ...args) {
        if (!commands.exists[cmd])
            throw new Error('redis cannot find the command of ' + cmd);
        if (cmd && this.useTransacte && commands.hasFlag(cmd, 'write'))
            return await this.transacte[cmd](...args);
        return await this.redis[cmd](...args);
    }
    get(name) {
        return this.exec('get', name);
    }
    set(name, value) {
        return this.exec('set', name, value);
    }
    hmset(name, value) {
        return this.exec('hmset', name, value);
    }
    hgetall(name) {
        return this.exec('hmset', name);
    }
    del(name) {
        return this.exec('del', name);
    }
    expire(name, time) {
        return this.exec('expire', name, time);
    }
    exists(name) {
        return this.exec('exists', name);
    }
}
exports.default = Redis;
