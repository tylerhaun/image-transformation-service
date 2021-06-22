const FsProvider = require("../shared-providers/FsProvider");


const defaultPath = "data";


class FsStorageProvider {

  constructor(args) {
    const path = process.env.FS_STORAGE_PATH || defaultPath;
    this.fsProvider = new FsProvider({path});
  }

  async read(name) {
    return this.fsProvider.read(name);
  }

  async write(name, data) {
    return this.fsProvider.write(name, data);
  }

  async list() {
    return fsProvider.list();
  }

}

module.exports = FsStorageProvider;
