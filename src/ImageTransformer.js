const Jimp = require("jimp");
const qs = require("qs");

class ImageTransformer {

  parseParams(params) { //TODO breakout into utils

    const parsed = qs.parse(params)
    Object.keys(parsed).forEach(key => {
      parsed[key] = Number(parsed[key])
    })
    return parsed;

    //return {
    //  //quality: 10,
    //  //width: 100,
    //  //height: 200,
    //};
  }

  async transform(data, params) {

    const transformConfig = this.parseParams(params)
    console.log("transformConfig", transformConfig);

    return new Promise(function(resolve, reject) {

      Jimp.read(data, (error, image) => {
        if (error) {
          console.error(error);
          throw error;
        }
        console.log("jimp image", image);

        const resizeParams = {
          width: -1,
          height: -1,
        }
        var shouldResize = false;
        if (transformConfig.width !== undefined) {
          shouldResize = true;
          resizeParams.width = transformConfig.width;
        }
        if (transformConfig.height !== undefined) {
          shouldResize = true;
          resizeParams.height = transformConfig.height;
        }
        console.log("resizeParams", resizeParams);
        console.log("shouldResize", shouldResize);
        if (shouldResize) {
          image.resize(resizeParams.width, resizeParams.height)
        }

        if (transformConfig.quality !== undefined) {
          image.quality(transformConfig.quality);
        }

        image.getBuffer("image/jpeg", (error, data) => {
          if (error) {
            console.error(error);
            return reject(error);
          }
          return resolve(data);
        })

      });

    })

  }

}

module.exports = ImageTransformer;
