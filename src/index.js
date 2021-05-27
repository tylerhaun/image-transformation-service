const dotenv = require("dotenv");

var express=require('express');
var bodyParser=require('body-parser');
// For Image
//var upload = multer({dest: '/public/uploads/'})
var fs=require('fs');
var path=require('path');

dotenv.config()


var app=express();


app.use(function(request, response, next) {
  console.log(request.ip, request.method, request.path);
  return next();
})

require("./routes/files/")(app);

app.use(function ErrorHandler(error, request, response, next) {
  console.log("ErrorHandler");
  console.error(error);
  const statusCode = error.statusCode || 500;
  response.status(statusCode);
  return response.send(statusCode + " " + error.toString())
})


// Run the Server
app.listen('3000',function(){
  console.log('Server is running at PORT '+3000);
});



class Main {

  async main() {

    //const ImageTransformer = require("./ImageTransformer");
    //const imageTransformer = new ImageTransformer();

    //imageTransformer.transform();


    // const file = s3.getObject({
    //   Bucket: config.bucket,
    //   Key: "snek.jpg",
    // }, function(err, data) {
    //     // Handle any error and exit
    //     if (err) {
    //       console.error(err)
    //       return err;
    //     }
    //   console.log(data);
    //   //fs.writeFile("test.jpg", data.Body,  "binary",function(err) { });
    //   let objectData = data.Body.toString('utf-8');
    // })
    // //console.log("file", file)
    // const ret = {
    //   data: file.Body,
    //   mimetype: file.ContentType
    // }


  }

}

const main = new Main();
main.main().catch(error => {
  console.error(error);
})




