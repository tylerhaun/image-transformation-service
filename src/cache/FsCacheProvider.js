const FsStorageProvider = require("../storage/FsStorageProvider");
const { CacheProvider  } = require(".");


const fsStorageProvider = new FsStorageProvider({path: "cache"});


class FsCacheProvider extends CacheProvider {

  async get(key) {
    return fsStorageProvider.read(key);
  }

  async set(key, value) {
    return fsStorageProvider.write(key, value);
  }

}

module.exports = FsCacheProvider;
