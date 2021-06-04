const dotenv = require("dotenv");
const express=require('express');
const bodyParser=require('body-parser');

const RequestLogger = require("./middleware/RequestLogger");
const NotFoundHandler = require("./middleware/NotFoundHandler");
const ErrorHandler = require("./middleware/ErrorHandler");

dotenv.config()


class Main {

  async main() {

    const app=express();
    app.use(bodyParser.json());
    app.use(RequestLogger);
    require("./routes/images/")(app);
    app.use(NotFoundHandler)
    app.use(ErrorHandler);

    const port = process.env.PORT;
    app.listen(port, function(){
      console.log("Server is running at PORT " + port);
      process.send("server.started") // message for tests
    });

  }

}

const main = new Main();
main.main().catch(error => {
  console.error(error);
})




