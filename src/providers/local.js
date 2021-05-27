const fs = require("fs");
const path = require("path");


class LocalStorageProvider {

  constructor() {

    this.directory = path.resolve(process.cwd(), "data");
    if (!fs.existsSync(this.directory)){
        fs.mkdirSync(this.directory);
    }
    
  }

  async read(name) {

    const imagePath = path.resolve(this.directory, name)
    return new Promise(function(resolve, reject) {
      fs.readFile(imagePath, function(error, data) {
        if (error) {
          return reject(error);
        }
        console.log("read image from " + imagePath);
        return resolve(data);
      })
    })

  }

  async write(name, data) {

    const imagePath = path.resolve(this.directory, name)
    return new Promise(function(resolve, reject) {
      fs.writeFile(imagePath, data, function(error, data) {
        if (error) {
          return reject(error);
        }
        console.log("saved image to " + imagePath);
        return resolve(data);
      })
    })

  }

}

module.exports = LocalStorageProvider;
