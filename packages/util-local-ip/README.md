# @hidoo/util-local-ip

> Utility that get current ip address in local network.

## Installation

```sh
$ npm install @hidoo/util-local-ip
```

## Usage

```js
import getLocalIps from '@hidoo/util-local-ip';

const ips = getLocalIps({ipv6: false, internal: true, external: false});
// ['127.0.0.1']
```

## Test

```sh
$ pnpm test
```

## License

MIT
