const dotenv = require("dotenv");

var express=require('express');
var bodyParser=require('body-parser');
// For Image
//var upload = multer({dest: '/public/uploads/'})
var fs=require('fs');
var path=require('path');

dotenv.config()

var AWS = require("aws-sdk");
s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var app=express();


app.use(function(request, response, next) {
  console.log(request.ip, request.method, request.path);
  return next();
})

// Show Image
//app.get('/show-image/:img_url',function(req,res){
//  res.render('image',{'imgUrl':req.params.img_url});
//});


require("./routes/files/")(app);

//app.post('/add-image',upload.single('image'), function(request, response, next){
//      // Save Image
//  console.log("add image");
//  console.log("file", request.file);
//  const putParams = {
//    Bucket: config.bucket,
//    Key: uuid() + "." + request.file.originalname.split(".").pop(),
//    Body: request.file.buffer,
//    ContentType: request.file.mimetype,
//    //ContentType: "application/json",
//  };
//  console.log("putParams", putParams);
//  s3.putObject(putParams, function(error, data) {
//    if (error) {
//      console.error(error);
//    }
//    return response.json(data)
//  })
//
//});

//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// Set Public Folder as static Path
//app.use(express.static(path.join(__dirname, 'public')));

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




class S3 {}



