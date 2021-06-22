const MemoryStorageProvider = require("./MemoryStorageProvider");
const FsStorageProvider = require("./FsStorageProvider");
const AwsStorageProvider = require("./AwsStorageProvider");

class StorageProviderFactory {

  getStorageProvider(type) {
    switch(type) {
      case "memory":
        return new MemoryStorageProvider();
      case "fs":
        return new FsStorageProvider();
      case "aws":
        return new AwsStorageProvider();
      default:
        throw new Error("Invalid storage provider type: " + type);
    }
  }

}


module.exports.StorageProviderFactory = StorageProviderFactory;

