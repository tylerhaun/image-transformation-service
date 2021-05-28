
module.exports = function NotFoundHandler(request, response, next) {
  const error = new Error("Not found");
  error.statusCode = 404;
  return next(error);
}

