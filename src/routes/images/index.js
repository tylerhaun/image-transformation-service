const uuid = require("uuid/v4");
const multer  = require('multer');

const { Readable } = require("stream");

const { StorageProviderFactory } = require("../../providers/")


var upload = multer()

const config = {
  bucket: "imagekit-replacement",
}

const qs = require("qs");


const _ = require("lodash");
function getCacheKey(name, args) {
  console.log("getCacheKey()", name, args);
  //const keys = ["height", "width", "quality"];
  const clean = _.pick(args, ["height", "width", "quality"])
  const keys = Object.keys(clean);
  keys.sort();
  const ret = keys.map(key => {
    const value = clean[key];
    if (value === undefined) {
      return;
    }
    return `${key}-${value}`
  }).join("_");
  console.log("ret", ret);

  return `${name}_${ret}`;

}
const LocalCacheProvider = require("../../CacheProvider");
const cacheProvider = new LocalCacheProvider();


module.exports = function(app) {

  const storageProviderFactory = new StorageProviderFactory();
  const storageProvider = storageProviderFactory.getStorageProvider(process.env.STORAGE_PROVIDER)

  app.route("/images/:name")
    .get(async function(request, response, next) {

      try {

        const ImageTransformer = require("../../ImageTransformer");
        const imageTransformer = new ImageTransformer();

        const filename = request.params.name;
        console.log(request.params)

        var data;
        console.log("query", request.query);
        const cacheKey = getCacheKey(request.params.name, qs.parse(request.query));
        console.log("cacheKey", cacheKey);
        data = await cacheProvider.get(cacheKey)
        if (data) {
          console.log("cache hit", data);
        }
        if (!data) {
          console.log("cache miss");
          data = await storageProvider.read(filename)
          console.log("data", data);
          if (!data) {
            const e = new Error("Image not found")
            e.statusCode = 404;
            throw e;
          }
          data = await imageTransformer.transform(data, request.query, data)
          await cacheProvider.set(cacheKey, data);
        }

        const readable = new Readable()
        readable._read = () => {}
        readable.push(data);
        readable.push(null);
        return readable.pipe(response);

      }
      catch(error) {
        console.log("catch error");
        console.error(error);
        return next(error)
      }

    })


  app.route("/images/")

    .post(upload.single('image'), function(request, response, next){

      console.log("add image");
      console.log("file", request.file);
      const filename = uuid() + "." + request.file.originalname.split(".").pop();
      storageProvider.write(filename, request.file.buffer)
        .then(data => {
          return response.json({name: filename});
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
