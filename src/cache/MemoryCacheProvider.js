const data = {};

class MemoryCacheProvider {

  async get(key) {
    return data[key];
  }

  async set(key, value) {
    data[key] = value;
  }

}

module.exports = MemoryCacheProvider;
