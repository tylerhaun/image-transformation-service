
module.exports = function RequestLogger(request, response, next) {
  console.log(request.ip, request.method, request.path);
  return next();
}

