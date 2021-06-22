const FsCacheProvider = require("./FsCacheProvider");
const MemoryCacheProvider = require("./MemoryCacheProvider");
const AwsCacheProvider = require("./AwsCacheProvider");

class CacheProviderFactory {

  getCacheProvider(type) {
    switch(type) {
      case "memory":
        return new MemoryCacheProvider();
      case "fs":
        return new FsCacheProvider();
      case "aws":
        return new AwsCacheProvider();
      default:
        throw new Error("Invalid cache provider type: " + type);
    }
  }

}


module.exports.CacheProviderFactory = CacheProviderFactory;

