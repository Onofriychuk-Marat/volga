require('module-alias/register')
const { notFound } = require('@src/utils/error');
const Product = require('./product.entity')
const imageUtils = require('@src/utils/image')

module.exports = class ProductService {
  response;

  constructor(response) {
    this.response = response;
  }

  async getList(limit, offset) {
    const products = await Product.findAll()
    if (offset === undefined)offset = 0;
    if (limit === undefined) limit = products.length
    return products.slice(offset, offset + limit)
  }

  async get(id) {
    if (!await this.isHaveById(id)) return;
    return (await Product.findAll({
      where: { id }
    }))[0]
  }

  add(product) {
    return Product.create(product)
  }

  async edit(id, product) {
    if (!await this.isHaveById(id)) return;
    const a = await Product.update(product, {
      where: { id }
    })
    return this.get(id)
  }

  async delete(id) {
    if (!await this.isHaveById(id)) return;
    const answer = await this.get(id)
    const imageUrl = answer.imageUrl
    if (imageUrl) {
      await imageUtils.deleteImage(imageUrl);
      await ProductService.deleteAllUrl(imageUrl);
    }
    await Product.destroy({
      where: { id }
    })
    return answer;
  }

  async deleteAll() {
    const products = await this.getList()
    for (const product of products) {
      if (product.imageUrl) {
        await imageUtils.deleteImage(product.imageUrl)
      }
    }
    await Product.destroy({
      where: {}
    })
    return products;
  }

  async uploadImageById(id, imageUrl) {
    if (imageUrl) {
      await this.edit(id, { imageUrl })
    }
    return this.get(id)
  }

  uploadImage(imageUrl) {
    return { imageUrl }
  }

  static async deleteAllUrl(imageUrl) {
    await Product.update({
      imageUrl: null
    }, {
      where: { imageUrl }
    })
  }

  async isHaveById(id) {
    const products = await Product.findAll({
      where: { id }
    })
    if (products.length === 0) {
      notFound(this.response)
      return false
    }
    return true
  }
}
