# @nelts/redis

基于[ioredis](https://www.npmjs.com/package/ioredis)的nelts插件。

# Usage

```bash
npm i @nelts/redis
```

# Example

```ts
import { AutoBindRedis } from '@nelts/redis';

export default (plu: LocalMasterPlugin) => {
  plu.on('props', async configs => {
    AutoBindRedis('reids', plu, configs.redis);
  });
}
```

# License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, yunjie (Evio) shen
