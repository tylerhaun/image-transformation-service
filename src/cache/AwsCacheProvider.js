const AwsProvider = require("../shared-providers/AwsProvider");


const defaultBucket = "image-transformation-service-cache";


class AwsCacheProvider {

  constructor(config) {
    const bucket = process.env.AWS_CACHE_BUCKET || defaultBucket;
    this.awsProvider = new AwsProvider({
      bucket,
    });
  }

  async get(key) {
    return this.awsProvider.get(key)
      .catch(error => {
        if (error.code == "NoSuchKey") {
          return null;
        }
        throw error;
      });
  }

  async set(key, value) {
    return this.awsProvider.put(key, value);
  }

}



module.exports = AwsCacheProvider;

