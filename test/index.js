const assert = require("assert");
const dotenv = require("dotenv");
const childProcess = require('child_process');
const Jimp = require("jimp");

dotenv.config({path: "test/.env.test"})

const ImageApi = require("./ImageApi");



class Main {

  async run() {
    console.log("run()");

    const imageApi = new ImageApi();

    const imagePath = "test/doge.jpg";
    const imageUploadResponse = await imageApi.upload(imagePath);
    console.log("uploaded image", imageUploadResponse.name);

    const transformConfig = {
      width: 400,
      height: 300,
      quality: 10,
    }

    var start = Date.now();
    const transformedImage = await imageApi.get(imageUploadResponse.name, transformConfig)
    const transformDuration = Date.now() - start;
    console.log("transform duration", transformDuration);

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


    var start = Date.now();
    const cachedImage = await imageApi.get(imageUploadResponse.name, transformConfig)
    const cacheDuration = Date.now() - start;
    console.log("cache duration", cacheDuration);

    assert(cacheDuration < transformDuration)
    console.log("\x1b[32m", "tests passed", "\x1b[0m");


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
        console.log("error occured; killing server...");
        return new Promise(function(resolve, reject) {
          setTimeout(() => {
            server.kill();
            console.log("server killed");
            return reject(error);
          }, 1000)
        })
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

