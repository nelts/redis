"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis = require("ioredis");
const commands = require('redis-commands');
class Redis {
    constructor(options) {
        this.useTransacte = false;
        this.transacte = null;
        this.redis = new ioredis(options);
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
}
exports.default = Redis;
