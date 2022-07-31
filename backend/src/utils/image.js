require('module-alias/register')
const fs = require("fs")
const { base_url, base_path_images, } = require('@src/configuration')
const url = require('url');
const chokidar = require('chokidar');
const ProductService = require('@src/product/product.service')
const formidable = require('formidable');

module.exports.uploadImage = async function(request, path) {

  const form = formidable({
    multiples: true,
    uploadDir: base_path_images + path,
    filename: (name) => name
  });

  return new Promise((resolve, reject) => {
    form.parse(request, (err, fields, files) => {
      if (err) {
        resolve()
        return;
      }
      let url = base_url + path + '/'
      url += files.image.newFilename
      resolve(url)
    });
  })

}

module.exports.loadImage = function(request) {
  return new Promise((resolve, reject) => {
    fs.readFile(base_path_images + request.url, function (err,data) {
      if (err) {
        resolve()
        return
      }
      resolve(data)
    });
  })
}

module.exports.deleteImage = async function(webUrl) {
  let appUrl = base_path_images
  appUrl += url.parse(webUrl, true).pathname

  try {
    fs.unlinkSync(appUrl);
  } catch { }
}

module.exports.watchImages = function() {
  // One-liner for current directory
  chokidar.watch(base_path_images).on('all', (event, path) => {
    if (event === 'unlink') {
      const words = path.split('/')
      const folder = words[words.length - 2]
      let webUrl = '/' + folder
      webUrl += '/' + words[words.length - 1]
      webUrl = base_url + webUrl
      if (folder === 'products') {
        ProductService.deleteAllUrl(webUrl)
      }
    }
  });
}