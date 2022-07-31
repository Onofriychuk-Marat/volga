require('module-alias/register')
require('@src/database')
require('@src/utils/image').watchImages()

const http = require("http")
const router = require("@src/router")
const { loadImage } = require('@src/utils/image')


http.createServer(async function(request, response){
  request.url = decodeURI(request.url)
  const image = await loadImage(request)
  if (image) {
    response.writeHead(200);
    response.end(image);
  } else { 
    router(request, response)
  }
}).listen(3000)
