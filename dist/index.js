"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis = require("ioredis");
const redis_1 = require("./redis");
exports.Redis = redis_1.default;
function AutoBindRedis(name, plu, options) {
    const app = plu.app;
    const redis = new ioredis(options);
    app.on('ContextStart', async (ctx) => {
        ctx[name] = new redis_1.default(redis);
        ctx.on('ContextResolve', async () => await ctx[name].commit());
    });
}
exports.AutoBindRedis = AutoBindRedis;
