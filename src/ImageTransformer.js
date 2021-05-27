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
    //  //q: 10,
    //  //w: 100,
    //  //h: 200,
    //};
  }

  async transform(params) {
    // q - quality
    // w - width
    // h - height

    const transformConfig = this.parseParams(params)
    console.log("transformConfig", transformConfig);

    return new Promise(function(resolve, reject) {

      Jimp.read("doge.jpg", (error, image) => {
        if (error) {
          console.error(error);
          throw error;
        }
        console.log("jimp image", image);
        //console.log(image.bitmap.width)


        const resizeParams = {
          w: -1,
          h: -1,
        }
        var shouldResize = false;
        if (transformConfig.w !== undefined) {
          shouldResize = true;
          resizeParams.w = transformConfig.w;
        }
        if (transformConfig.h !== undefined) {
          shouldResize = true;
          resizeParams.h = transformConfig.h;
        }
        console.log("resizeParams", resizeParams);
        console.log("shouldResize", shouldResize);
        if (shouldResize) {
          image.resize(+resizeParams.w, resizeParams.h)
        }

        if (transformConfig.q !== undefined) {
          image.quality(transformConfig.q);
        }

        //image.write("doge-transformed.jpg", (error, data) => {
        //  if (error) {
        //    console.error(error);
        //  }
        //  console.log("done", data);
        //})

        image.getBuffer("image/jpeg", (error, data) => {
          if (error) {
            console.error(error);
            return reject(error);
          }
          return resolve(data);
        })
        //.greyscale()
        //.write('lena-small-bw.jpg');
      });

    })


  }

  applyTransforms(image) {
  
  }



}

module.exports = ImageTransformer;
