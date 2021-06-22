const Jimp = require("jimp");
const qs = require("qs");
const ResizeTransformation = require("./transformations/ResizeTransformation");
const QualityTransformation = require("./transformations/QualityTransformation");


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
    this.transformations.push(transformation)
  }

  async execute(data) {
    const transformations = this.transformations;
    if (transformations.length == 0) {
      return data;
    }

    return new Promise(function(resolve, reject) {

      Jimp.read(data, (error, image) => {
        if (error) {
          return reject(error);
        }

        transformations.forEach(transformation => {
          transformation.transform(image);
        })

        image.getBuffer("image/jpeg", (error, data) => {
          if (error) {
            return reject(error);
          }
          return resolve(data);
        })
      })

    })
  }
}


module.exports = ImageTransformer;
