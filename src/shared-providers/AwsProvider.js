const AWS = require("aws-sdk");


const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const config = {
  bucket: "image-transformation-service",
}


class AwsProvider {

  constructor(config) {
    this.config = config;
  }

  async get(name) {

    const bucket = this.config.bucket || config.bucket;

    return new Promise(function(resolve, reject) {

      const file = s3.getObject({
        Bucket: bucket,
        Key: name,
      }, function(error, data) {
        if (error) {
          return reject(error);
        }
        return resolve(data.Body);
      })

    })
  }

  async put(name, data) {

    const bucket = this.config.bucket || config.bucket;

    return new Promise(function(resolve, reject) {
    
      const putParams = {
        Bucket: bucket,
        Key: name,
        Body: data,
      };
      s3.putObject(putParams, function(error, data) {
        if (error) {
          return reject(error);
        }
        return resolve({name});
        //return response.json(data)
      })

    })

  }

}

module.exports = AwsProvider;
