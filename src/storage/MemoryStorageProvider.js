const fs = require("fs");
const path = require("path");


class MemoryStorageProvider {

  constructor(args) {
    this.data = {};
  }

  async read(name) {

    return this.data[name];

  }

  async write(name, data) {

    this.data[name]=data;

  }

  async list() {

    return Object.keys(data);

  }

}

module.exports = MemoryStorageProvider;
