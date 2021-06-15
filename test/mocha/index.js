const assert = require("assert");
const axios = require("axios");
const childProcess = require("child_process");
const dotenv = require("dotenv");
const Jimp = require("jimp");

dotenv.config();



var smsBuffer;

class TestServer {

  async start() {

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


      server.stdout.on('data', function(data) {
        console.log("server stdout", data.toString()); 
      });
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

      server.on("message", (m) => {
        console.log("received message", m);
        try {
          var data = JSON.parse(m);
          console.log(data);
          if (data.event == "sms.sent") {
            smsBuffer = data.message;
            console.log("smsBuffer");
          }
        }
        catch(e) {}
      })

    })
  
  }

}






before(async () => {  
  console.log("before");
  const testServer = new TestServer();
  console.log("starting test server...");
  await testServer.start();
  console.log("server started");
  //await Elastic.ensureIndices()
})





const axiosConfig = {
  baseURL: `http://localhost:${process.env.PORT}/`,
};
const apiRequest = axios.create(axiosConfig);

describe("Test test server", () => {
  it("should ping", async () => {
    const response = await apiRequest.get("ping");
    console.log("response.data", response.data);
  })
})


const ImageApi  = require("../ImageApi");
const imageApi = new ImageApi();


const username = "test";
const password = "password1";

var userId; // TODO hacky; fix
describe("API", () => {
  describe("Image", () => {
    var imageName;
    describe("Upload", () => {
      it("should successfully upload an image", async function() {
        this.timeout(5000);
        const result = await imageApi.upload("test/doge.jpg");
        console.log(result)
        imageName = result.name;
      })
      it("should successfully upload an image with custom name", async function() {
        this.timeout(5000);
        const testName = "testName";
        const result = await imageApi.upload("test/doge.jpg", "testName");
        console.log("result", result)
        assert(result.name == testName);
      })
    })
    describe("Get", () => {
      it("should successfully retrieve image", async function() {
        this.timeout(5000);
        const imageBuffer = await imageApi.get(imageName);

        const image = await new Promise(function(resolve, reject) {
          Jimp.read(imageBuffer, (error, image) => {
            if (error) {
              console.error(error);
              return reject(error);
            }
            return resolve(image);
          })
        })
      })
      it("should preserve image dimensions", async function() {
        this.timeout(5000);
        const imageBuffer = await imageApi.get(imageName);

        const image = await new Promise(function(resolve, reject) {
          Jimp.read(imageBuffer, (error, image) => {
            if (error) {
              console.error(error);
              return reject(error);
            }
            return resolve(image);
          })
        })

        assert(image.bitmap.width == 900);
        assert(image.bitmap.height == 900);
      })
      it("should resize image", async function() {
        this.timeout(5000);
        const transformConfig = {
          width: 100,
          height: 100,
        };
        const imageBuffer = await imageApi.get(imageName, transformConfig);

        const image = await new Promise(function(resolve, reject) {
          Jimp.read(imageBuffer, (error, image) => {
            if (error) {
              console.error(error);
              return reject(error);
            }
            return resolve(image);
          })
        })

        assert(image.bitmap.width == transformConfig.width);
        assert(image.bitmap.height == transformConfig.height);
      })
      it("should use image cache", async function() {
        this.timeout(5000);
        const transformConfig = {
          width: 102,
          height: 102,
        };

        var start = Date.now();
        const transformedImage = await imageApi.get(imageName, transformConfig);
        const transformDuration = Date.now() - start;

        var start = Date.now();
        const cahedImage = await imageApi.get(imageName, transformConfig);
        const cacheDuration = Date.now() - start;

        console.log({transformDuration, cacheDuration})
        // at least 2x faster
        assert(cacheDuration < transformDuration / 2)
      })
    })
  })

})


