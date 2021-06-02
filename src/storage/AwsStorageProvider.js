const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});


const config = {
  bucket: "imagekit-replacement",
}


class AwsStorageProvider {

  async read(name) {

    return new Promise(function(resolve, reject) {

      const file = s3.getObject({
        Bucket: config.bucket,
        Key: name,
      }, function(error, data) {
        if (error) {
          console.error(error)
          return reject(error);
        }
        console.log(data);
        return resolve(data.Body);
      })

    })
  }

  async write(name, data) {

    return new Promise(function(resolve, reject) {
    
      const putParams = {
        Bucket: config.bucket,
        Key: name,
        Body: data,
        //ContentType: request.file.mimetype,
        //ContentType: "application/json",
      };
      console.log("putParams", putParams);
      s3.putObject(putParams, function(error, data) {
        if (error) {
          console.error(error);
          return reject(error);
        }
        return resolve({name});
        //return response.json(data)
      })

    })

  }

}

module.exports = AwsStorageProvider;
