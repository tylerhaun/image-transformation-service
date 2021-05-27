const uuid = require("uuid/v4");
const multer  = require('multer');

const { Readable } = require("stream");

//const LocalStorageProvider = require("../../../providers/local");
//const AwsStorageProvider = require("../../../providers/aws");
const { StorageProviderFactory } = require("../../../providers/")


var upload = multer()

const config = {
  bucket: "imagekit-replacement",
}


module.exports = function(app) {

  const storageProviderFactory = new StorageProviderFactory();
  const storageProvider = storageProviderFactory.getStorageProvider("aws")
  //const storageProvider = new AwsStorageProvider({});

  app.route("/files/")
    .post(upload.single('image'), function(request, response, next){
      // Save Image
      console.log("add image");
      console.log("file", request.file);
      const filename = uuid() + "." + request.file.originalname.split(".").pop();
      storageProvider.write(filename, request.file.buffer)
        .then(data => {
          return response.json(data);
        })
        .catch(error => {
          return next(error);
        })


      //const putParams = {
      //  Bucket: config.bucket,
      //  Key: uuid() + "." + request.file.originalname.split(".").pop(),
      //  Body: request.file.buffer,
      //  //ContentType: request.file.mimetype,
      //  //ContentType: "application/json",
      //};
      //console.log("putParams", putParams);
      //s3.putObject(putParams, function(error, data) {
      //  if (error) {
      //    console.error(error);
      //  }
      //  return response.json(data)
      //})

    })

  app.route("/files/:name")
    .get(function(request, response, next) {

      //const file = s3.getObject({
      //  Bucket: config.bucket,
      //  Key: "snek.jpg",
      //}, function(err, data) {
      //  // Handle any error and exit
      //  if (err) {
      //    console.error(err)
      //    return err;
      //  }
      //  console.log(data);
      //  //fs.writeFile("test.jpg", data.Body,  "binary",function(err) { });
      //  let objectData = data.Body.toString('utf-8');
      //})
      ////console.log("file", file)
      //const ret = {
      //  data: file.Body,
      //  mimetype: file.ContentType
      //}
      //console.log("ret", ret);

      const filename = request.params.name;
      console.log(request.params)
      storageProvider.read(filename)
        .then(data => {

          const readable = new Readable()
          readable._read = () => {} // _read is required but you can noop it
          readable.push(data)
          readable.push(null)

          readable.pipe(response) // consume the stream

          //file.pipe(res);
          return next();

        })
        .catch(error => {
          return next(error);
        })

    })



}
