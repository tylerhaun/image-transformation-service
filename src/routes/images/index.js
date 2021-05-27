const uuid = require("uuid/v4");
const multer  = require('multer');

const { Readable } = require("stream");

const { StorageProviderFactory } = require("../../providers/")


var upload = multer()

const config = {
  bucket: "imagekit-replacement",
}


module.exports = function(app) {

  const storageProviderFactory = new StorageProviderFactory();
  const storageProvider = storageProviderFactory.getStorageProvider("local")

  app.route("/files/:name")
    .get(function(request, response, next) {

      const ImageTransformer = require("../../ImageTransformer");
      const imageTransformer = new ImageTransformer();

      const filename = request.params.name;
      console.log(request.params)

      storageProvider.read(filename)
        .then(async (data) => {

          const transformedImage = await imageTransformer.transform(request.query, data)

          const readable = new Readable()
          readable._read = () => {}
          readable.push(transformedImage);
          readable.push(null);

          return readable.pipe(response);

        })
        .catch(error => {
          console.error(error);
          return next(error);
        })

    })


  app.route("/files/")
    .post(upload.single('image'), function(request, response, next){

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

    })
    .get(function(request, response, next) {

      //const paginationParams = _.pick(request.query, ["page", "pageSize"])
      storageProvider.list()
        .then(files => {
          return response.json({files});
        })
        .catch(next);
    })





}
