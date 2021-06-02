const { CacheProvider  } = require(".");

const data = {};

class MemoryCacheProvider extends CacheProvider {

  async get(key) {
    return data[key];
  }

  async set(key, value) {
    data[key] = value;
  }

}

module.exports = MemoryCacheProvider;
