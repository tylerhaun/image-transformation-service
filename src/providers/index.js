
class StorageProvider {

  async read(name) {
    throw new Error("Not implemented");
  }

  async write(name, buffer) {
    throw new Error("Not implemented");
  }

  async list() {
    throw new Error("Not implemented");
  }

}
module.exports.StorageProvider = StorageProvider;


const LocalStorageProvider = require("./local");
const AwsStorageProvider = require("./aws");

class StorageProviderFactory {

  getStorageProvider(type) {
    switch(type) {
      case "local":
        return new LocalStorageProvider();
      case "aws":
        return new AwsStorageProvider();
      default:
        throw new Error("Invalid storage provider type: " + type);
    }
  }

}


module.exports.StorageProviderFactory = StorageProviderFactory;

