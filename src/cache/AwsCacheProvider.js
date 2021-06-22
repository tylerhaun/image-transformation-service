const AwsProvider = require("../shared-providers/AwsProvider");


class AwsCacheProvider {

  constructor(config) {
    this.awsProvider = new AwsProvider(config);
  }

  async get(key) {
    return this.awsProvider.get(key);
  }

  async set(key, value) {
    return this.awsProvider.put(key, value);
  }

}



module.exports = AwsCacheProvider;

