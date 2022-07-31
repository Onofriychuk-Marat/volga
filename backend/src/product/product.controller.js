require('module-alias/register')

const { notFound } = require('@src/utils/error');
const { Controller } = require('@src/utils/endpoint')

const ServiceProducts = require('./product.service')
const { uploadImage } = require('@src/utils/image')

module.exports = async function (request, response) {
  const service = new ServiceProducts(response);
  const ctr = new Controller(request)

  ctr.endpoint('/products?limit=0&offset=0', 'GET', () => {
    const { limit, offset } = ctr.pagination
    answer(service.getList(limit, offset))
  })

  ctr.endpoint('/products?limit=0', 'GET', () => {
    const { limit } = ctr.pagination
    answer(service.getList(limit))
  })

  ctr.endpoint('/products?offset=0', 'GET', () => {
    const { offset } = ctr.pagination
    answer(service.getList(undefined, offset))
  })

  ctr.endpoint('/products', 'GET', () => {
    answer(service.getList())
  })

  ctr.endpoint('/products/:id', 'GET', () => {
    const id = ctr.params[0]
    answer(service.get(id))
  })

  ctr.endpoint('/products', 'POST', async () => {
    const body = await ctr.getBody()
    answer(service.add(body))
  })

  ctr.endpoint('/products/:id', 'PATCH', async () => {
    const body = await ctr.getBody(request)
    const id = ctr.params[0]
    answer(service.edit(id, body))
  })

  ctr.endpoint('/products/:id', 'DELETE', () => {
    const id = ctr.params[0]
    answer(service.delete(id))
  })

  ctr.endpoint('/products', 'DELETE', () => {
    answer(service.deleteAll())
  })

  ctr.endpoint('/products/:id/upload-image', 'POST', async () => {
    const imageUrl = await uploadImage(request, '/products')
    const id = ctr.params[0]
    answer(service.uploadImageById(id, imageUrl))
  })

  ctr.endpoint('/products/upload-image', 'POST', async () => {
    const imageUrl = await uploadImage(request, '/products')
    answer(service.uploadImage(imageUrl))
  })

  if (!ctr.isFinded) {
    notFound(response)
  }

  async function answer(promiseValue) {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify(await promiseValue))
  }
}


