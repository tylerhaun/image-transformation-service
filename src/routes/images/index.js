const uuid = require("uuid").v4;
const multer  = require('multer');
const qs = require("qs");
const { Readable } = require("stream");

const { StorageProviderFactory } = require("../../storage/")
const { CacheProviderFactory } = require("../../cache/");
const ImageTransformer = require("../../ImageTransformer");
const { getCacheKey } = require("../../utils");


const cacheProviderFactory = new CacheProviderFactory();
const storageProviderFactory = new StorageProviderFactory();

const cacheProvider = cacheProviderFactory.getCacheProvider(process.env.CACHE_PROVIDER)
const storageProvider = storageProviderFactory.getStorageProvider(process.env.STORAGE_PROVIDER)

const upload = multer()


module.exports = function(app) {


  app.route("/images/:name")
    .get(async function(request, response, next) {

      try {

        var data;
        const filename = request.params.name;
        const cacheKey = getCacheKey(request.params.name, request.query);
        data = await cacheProvider.get(cacheKey)
        if (data) {
          //console.log("cache hit", data);
        }
        if (!data) {
          data = await storageProvider.read(filename)
          if (!data) {
            const e = new Error("Image not found")
            e.statusCode = 404;
            throw e;
          }
          const imageTransformer = new ImageTransformer(request.query);
          if (imageTransformer.transformations.length > 0) {
            data = await imageTransformer.execute(data);
            await cacheProvider.set(cacheKey, data);
          }
        }

        const readable = new Readable()
        readable._read = () => {}
        readable.push(data);
        readable.push(null);
        return readable.pipe(response);

      }
      catch(error) {
        console.error(error);
        return next(error)
      }

    })


  app.route("/images/")

    .post(upload.any(), function(request, response, next) {

      if (request.files.length > 1) {
        next(new Error("Only one file supported"));
      }
      const file = request.files[0];
      const filename = request.body.name || uuid() + "." + file.originalname.split(".").pop();
      storageProvider.write(filename, file.buffer)
        .then(data => {
          return response.json({name: filename});
        })
        .catch(error => {
          return next(error);
        })

    })

    .get(function(request, response, next) {

      storageProvider.list()
        .then(files => {
          return response.json({files});
        })
        .catch(next);
    })





}
