import * as ioredis from 'ioredis';
export default class Redis {
    private readonly redis;
    private useTransacte;
    private pools;
    private transacteValues;
    constructor(redis: ioredis.Redis);
    begin(): this;
    commit(): Promise<this>;
    rollback(): Promise<void>;
    private execute;
    get(name: string): Promise<any>;
    set(name: string, value: any): Promise<void>;
    hmset(name: string, value: any): Promise<void>;
    hgetall(name: string): Promise<any>;
    del(name: string): Promise<number>;
    expire(name: string, time: number): Promise<number>;
    exists(name: string): Promise<number>;
}
