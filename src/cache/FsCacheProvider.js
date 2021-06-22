const FsProvider = require("../shared-providers/FsProvider");


class FsCacheProvider {

  constructor() {
    this.fsProvider = new FsProvider({path: "cache"});
  }

  async get(key) {
    return this.fsProvider.read(key);
  }

  async set(key, value) {
    return this.fsProvider.write(key, value);
  }

}

module.exports = FsCacheProvider;
