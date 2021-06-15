
module.exports = function ErrorHandler(error, request, response, next) {
  console.error(error);
  const statusCode = error.statusCode || 500;
  response.status(statusCode);
  return response.send(statusCode + " " + error.toString())
}

