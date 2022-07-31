module.exports.notFound = function (response) {
  response.statusCode = 404;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({
    message: "Endpoint not found!"
  }))
}

module.exports.badRequest = function (response) {
  response.statusCode = 500;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify({
    message: "Bad request!"
  }))
}