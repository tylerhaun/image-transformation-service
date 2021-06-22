

class BaseTransformation {
  constructor(config) {
    this.config = config;
  }
  async transform(image) {
    throw new Error("Not implemented");
  }
}


module.exports = BaseTransformation;
