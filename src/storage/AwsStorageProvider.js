const AwsProvider = require("../shared-providers/AwsProvider");
//const AWS = require("aws-sdk");
//const s3 = new AWS.S3({
//  apiVersion: "2006-03-01",
//  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//});


//const config = {
//  bucket: "imagekit-replacement",
//}


class AwsStorageProvider {

  constructor(config) {
    this.awsProvider = new AwsProvider(config);
  }

  async read(name) {
    return this.awsProvider.get(key);

    //return new Promise(function(resolve, reject) {

    //  const file = s3.getObject({
    //    Bucket: config.bucket,
    //    Key: name,
    //  }, function(error, data) {
    //    if (error) {
    //      return reject(error);
    //    }
    //    return resolve(data.Body);
    //  })

    //})
  }

  async write(name, data) {
    return this.awsProvider.put(key, value);

    //return new Promise(function(resolve, reject) {
    //
    //  const putParams = {
    //    Bucket: config.bucket,
    //    Key: name,
    //    Body: data,
    //  };
    //  s3.putObject(putParams, function(error, data) {
    //    if (error) {
    //      return reject(error);
    //    }
    //    return resolve({name});
    //    //return response.json(data)
    //  })

    //})

  }

}

module.exports = AwsStorageProvider;
