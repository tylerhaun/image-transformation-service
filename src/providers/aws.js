
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
        // Handle any error and exit
        if (error) {
          console.error(error)
          return reject(error);
        }
        console.log(data);
        //fs.writeFile("test.jpg", data.Body,  "binary",function(err) { });
        return resolve(data.Body);
        //let objectData = data.Body.toString('utf-8');
      })
      //console.log("file", file)
      //const ret = {
      //  data: file.Body,
      //  mimetype: file.ContentType
      //}
      //console.log("ret", ret);

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
