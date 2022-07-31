const controller = require('./product.controller')

module.exports = function (request, response) {
  controller(request, response);
}