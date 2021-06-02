const fs = require("fs");
const path = require("path");

const { StorageProvider } = require(".");


class LocalStorageProvider extends StorageProvider {

  constructor(args) {
    super(arguments);
    args = args || {};
    args.path = args.path || "data";
    this.directory = path.resolve(process.cwd(), args.path);
    if (!fs.existsSync(this.directory)){
        fs.mkdirSync(this.directory);
    }
  }

  async read(name) {

    const imagePath = path.resolve(this.directory, name)
    return new Promise(function(resolve, reject) {
      fs.readFile(imagePath, function(error, data) {
        if (error) {
          console.error(error);
          if (error.errno == -2) { // no such file or directory
            return resolve(null)
          }
              throw error;
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
      fs.writeFile(imagePath, data, function(error, result) {
        if (error) {
          return reject(error);
        }
        console.log("saved image to " + imagePath);
        return resolve(result);
      })
    })

  }

  async list() {
    const directory = this.directory;
    return new Promise(function(resolve, reject) {
      fs.readdir(directory, (error, files) => {
        if (error) {
          console.error(error);
          return reject(error);
        }
        return resolve(files);
      });
    })
  }

}

module.exports = LocalStorageProvider;
