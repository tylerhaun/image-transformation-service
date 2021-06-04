const assert = require("assert");
const fs = require("fs");
const dotenv = require("dotenv");
const childProcess = require('child_process');
const axios = require("axios");
const FormData = require('form-data');
const qs = require("qs");
const Jimp = require("jimp");

dotenv.config({path: "test/.env.test"})



const axiosConfig = {
  baseURL: `http://localhost:${process.env.PORT}/`,
};
const apiRequest = axios.create(axiosConfig);


class Main {

  async uploadImage(imagePath) {

    const form = new FormData();
    form.append('file', fs.createReadStream(imagePath));

    const requestConfig = {
      headers: {
        ...form.getHeaders()
      }
    };
    const response = await apiRequest.post("images", form, requestConfig)
      .catch(error => {
        console.error(error.data)
        throw error;
      });
    return response.data;

  }


  async getFile(fileName, transformConfig) {

    const queryParams = qs.stringify(transformConfig);

    const fullUrl = `/images/${fileName}?${queryParams}`;
    const response = await apiRequest.get(fullUrl, {
      responseType: 'arraybuffer'
    })
      .catch(error => {
        console.error(error.data);
        throw error;
      })
    return response.data;

  }


  async run() {
    console.log("run()");

    const fileUploadResponse = await this.uploadImage("doge.jpg");

    const transformConfig = {
      width: 400,
      height: 300,
      quality: 10,
    }
    const transformedImage = await this.getFile(fileUploadResponse.name, transformConfig)

    const image = await new Promise(function(resolve, reject) {
      Jimp.read(transformedImage, (error, image) => {
        if (error) {
          console.error(error);
          return reject(error);
        }
        return resolve(image);
      })
    })

    assert(image.bitmap.width == transformConfig.width)
    assert(image.bitmap.height == transformConfig.height)
    console.log("tests passed");


  }

  async main() {

    const server = await this.startServer()
      .catch(error => {
        console.log("server error");
        console.error(error);
      });
    console.log("server started");
    await this.run()
      .catch(error => {
        console.log("error occured; killing server");
        server.kill();
        throw error;
      })

    server.kill();



  }


  async startServer() {

    return new Promise(function(resolve, reject) {

      const scriptPath = "./src/index.js";
      var server = childProcess.fork(scriptPath, [], {silent: true});

      server.on('spawn', function (err) {
        console.log("spawned", err);
      });
      server.on('error', function (err) {
        console.error("error", err);
      });

      server.on('exit', function (code, signal) {
        console.log("server exited", code, signal);
      });
      server.on('close', function (code, signal) {
        console.log("server exited", code, signal);
      });


      //server.stdout.on('data', function(data) {
      //  console.log("server stdout", data.toString()); 
      //});
      server.stderr.on('data', function(data) {
        console.log("server stderr");
        console.error(data.toString()); 
      });

      console.log("waiting for server to start...");
      server.on("message", (m) => {
        console.log("received message", m);
        if (m == "server.started") {
          return resolve(server);
        }
      })

    })

  }

}


const main = new Main();
main.main()
  .catch(error => {
    console.log("error in main");
    console.error(error);
  });

