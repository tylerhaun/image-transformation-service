const BaseTransformation = require("./BaseTransformation");


class QualityTransformation extends BaseTransformation {

  transform(image) {
    if (this.config.quality !== undefined) {
      image.quality(this.config.quality);
    }

  }

}


module.exports = QualityTransformation;
