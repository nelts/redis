"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("./redis");
function AutoBindRedis(name, plu, options) {
    const app = plu.app;
    const redis = new redis_1.default(options);
    app.on('ContextStart', async (ctx) => {
        ctx[name] = redis;
        ctx.on('ContextResolve', async () => await ctx[name].commit());
    });
}
exports.AutoBindRedis = AutoBindRedis;
