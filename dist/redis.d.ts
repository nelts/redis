import * as ioredis from 'ioredis';
export default class Redis {
    private readonly redis;
    private useTransacte;
    private transacte;
    constructor(redis: ioredis.Redis);
    begin(): this;
    commit(): Promise<this>;
    exec(cmd: string, ...args: any[]): Promise<any>;
    get(name: string): Promise<any>;
    set(name: string, value: any): Promise<any>;
    hmset(name: string, value: any): Promise<any>;
    hgetall(name: string): Promise<any>;
    del(name: string): Promise<any>;
    expire(name: string, time: number): Promise<any>;
}
