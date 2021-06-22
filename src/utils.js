const _ = require("lodash");

module.exports = {

  getCacheKey: function getCacheKey(name, args) {

    const clean = _.pick(args, ["height", "width", "quality"])
    const keys = Object.keys(clean);
    keys.sort();
    const ret = keys.map(key => {
      const value = clean[key];
      if (value === undefined) {
        return;
      }
      return `${key}-${value}`
    }).join("_");

    return `${name}_${ret}`;

  }

}
