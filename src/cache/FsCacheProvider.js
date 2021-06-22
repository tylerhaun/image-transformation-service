const FsProvider = require("../shared-providers/FsProvider");


const defaultPath = "cache";


class FsCacheProvider {

  constructor() {
    const path = process.env.FS_CACHE_PATH || defaultPath;
    this.fsProvider = new FsProvider({path});
  }

  async get(key) {
    return this.fsProvider.read(key)
      .catch(error => {
        if (error.errno == -2) { // no such file or directory
          return null;
        }
        throw error;
      });
  }

  async set(key, value) {
    return this.fsProvider.write(key, value);
  }

}

module.exports = FsCacheProvider;
