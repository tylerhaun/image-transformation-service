const LocalStorageProvider = require("./local");
const AwsStorageProvider = require("./aws");


//class StorageProvider {
//
//  async read(name) {
//  
//  }
//
//  async write(name, buffer) {
//  
//  }
//
//}


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

