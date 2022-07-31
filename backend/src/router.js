require('module-alias/register')
const { baseUrl } = require('@src/utils/endpoint')
const product = require('@src/product');
const { notFound } = require('@src/utils/error');

module.exports = async function (request, response) {
  if (baseUrl(request, '/products')) {
    product(request, response);
  } else {
    notFound(response)
  }
}
