const Jimp = require("jimp");
const qs = require("qs");


class ImageTransformer {

  constructor(query) {
    this.transformations = [];

    const transformConfig = this.parseParams(query)
    if (transformConfig.width !== undefined || transformConfig.height !== undefined) {
      this.addTransformation(new ResizeTransformation(transformConfig));
    }
    if (transformConfig.quality !== undefined) {
      this.addTransformation(new QualityTransformation(transformConfig));
    }

  }

  parseParams(params) {

    const parsed = qs.parse(params)
    Object.keys(parsed).forEach(key => {
      parsed[key] = Number(parsed[key])
    })
    return parsed;

  }

  addTransformation(transformation) {
    console.log("addTransformation()", transformation);
    this.transformations.push(transformation)
  }

  async execute(data) {
    console.log("execute()", data);
    const transformations = this.transformations;
    if (transformations.length == 0) {
      console.log("no transformations");
      return data;
    }

    return new Promise(function(resolve, reject) {

      console.log("jimp.read()");
      Jimp.read(data, (error, image) => {
        if (error) {
          console.error(error);
          return reject(error);
        }

        transformations.forEach(transformation => {
          console.log("executing tranformation", transformation)
          transformation.transform(image);
        })

        image.getBuffer("image/jpeg", (error, data) => {
          if (error) {
            console.error(error);
            return reject(error);
          }
          return resolve(data);
        })
      })

    })
  }
}


class BaseTransformation {
  constructor(config) {
    this.config = config;
  }
  async transform(image) {
    throw new Error("Not implemented");
  }
}


class ResizeTransformation extends BaseTransformation {

  transform(image) {
    console.log("transform()", image);

    const resizeParams = {
      width: -1,
      height: -1,
    }
    resizeParams.width = this.config.width;
    resizeParams.height = this.config.height;

    image.resize(resizeParams.width, resizeParams.height)

  }
}


class QualityTransformation extends BaseTransformation {

  transform(image) {
    console.log("transform()", image);
    if (this.config.quality !== undefined) {
      image.quality(this.config.quality);
    }

  }

}

module.exports = ImageTransformer;
