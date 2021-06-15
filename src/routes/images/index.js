const _ = require("lodash");
const uuid = require("uuid/v4");
const multer  = require('multer');
const qs = require("qs");
const { Readable } = require("stream");

const { StorageProviderFactory } = require("../../storage/")
const { CacheProviderFactory } = require("../../cache/");
const ImageTransformer = require("../../ImageTransformer");

const cacheProviderFactory = new CacheProviderFactory();
const storageProviderFactory = new StorageProviderFactory();

const cacheProvider = cacheProviderFactory.getCacheProvider(process.env.CACHE_PROVIDER || "fs")
const storageProvider = storageProviderFactory.getStorageProvider(process.env.STORAGE_PROVIDER || "fs")

const upload = multer()

const config = {
  bucket: "imagekit-replacement",
}



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


module.exports = function(app) {


  app.route("/images/:name")
    .get(async function(request, response, next) {

      try {

        var data;
        const filename = request.params.name;
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
          //data = await imageTransformer.transform(data, request.query, data)
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
        console.log("catch error");
        console.error(error);
        return next(error)
      }

    })


  app.route("/images/")

    .post(/*upload.single('image')*/upload.any(), function(request, response, next){

      console.log("add image");
      if (request.files.length > 1) {
        next(new Error("Only one file supported"));
      }
      const file = request.files[0];
      console.log("file", file);
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

      //const paginationParams = _.pick(request.query, ["page", "pageSize"])
      storageProvider.list()
        .then(files => {
          return response.json({files});
        })
        .catch(next);
    })





}
