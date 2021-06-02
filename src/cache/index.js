
class CacheProvider {

  async get(key) {
    throw new Error("Not implemented");
  }

  async set(key, value) {
    throw new Error("Not implemented");
  }

}
module.exports.CacheProvider = CacheProvider;


const FsCacheProvider = require("./FsCacheProvider");
const MemoryCacheProvider = require("./MemoryCacheProvider");
//const AwsStorageProvider = require("./AwsStorageProvider");

class CacheProviderFactory {

  getCacheProvider(type) {
    switch(type) {
      case "memory":
        return new MemoryCacheProvider();
      case "fs":
        return new FsCacheProvider();
        //case "aws":
        //careturn new AwsCacheProvider();
      default:
        throw new Error("Invalid storage provider type: " + type);
    }
  }

}


module.exports.CacheProviderFactory = CacheProviderFactory;

