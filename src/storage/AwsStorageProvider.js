const AwsProvider = require("../shared-providers/AwsProvider");


const defaultBucket = "image-transformation-service-storage";


class AwsStorageProvider {

  constructor(config) {
    const bucket = process.env.AWS_STORAGE_BUCKET || defaultBucket;
    this.awsProvider = new AwsProvider({bucket});
  }

  async read(name) {
    return this.awsProvider.get(name);
  }

  async write(name, data) {
    return this.awsProvider.put(name, data);
  }

}

module.exports = AwsStorageProvider;
