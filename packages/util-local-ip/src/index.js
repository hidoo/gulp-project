import os from 'os';

/**
 * default options
 * @type {Object}
 */
const DEFAULT_OPTIONS = {

  // include ipv6 address or not
  ipv6: true,

  // include internal address or not
  internal: true,

  // include external address or not
  external: true
};

/**
 * return current ip addresses in local network.
 * @param {Object} options options
 * @return {Array}
 *
 * @example
 * const ips = getLocalIps({ipv6: true, internal: true, external: true});
 */
export default function getLocalIps(options = {}) {
  const opts = {...DEFAULT_OPTIONS, ...options},
        ifaces = os.networkInterfaces(),
        ips = [];

  Object.values(ifaces).forEach((iface) => iface.forEach((details) => {

    // exclude ipv6
    if (!opts.ipv6 && details.family === 'IPv6') {
      return;
    }

    // exclude internal ip
    if (!opts.internal && details.internal) {
      return;
    }

    // exclude external ip
    if (!opts.external && !details.internal) {
      return;
    }

    ips.push(details.address);
  }));

  return ips.sort();
}
