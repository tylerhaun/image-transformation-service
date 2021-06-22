const BaseTransformation = require("./BaseTransformation");


class ResizeTransformation extends BaseTransformation {

  transform(image) {

    const resizeParams = {
      width: -1,
      height: -1,
    }
    if (this.config.width !== undefined) {
      resizeParams.width = this.config.width;
    }
    if (this.config.height !== undefined) {
      resizeParams.height = this.config.height;
    }

    image.resize(resizeParams.width, resizeParams.height)

  }
}


module.exports = ResizeTransformation;
