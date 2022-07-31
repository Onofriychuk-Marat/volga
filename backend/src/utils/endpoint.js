const url = require('url');

module.exports.Controller = class {
  isFinded = false;
  pagination;
  params = [];
  request;

  constructor(request) {
    this.request = request;
  }

  getBody() {
    return new Promise((resolve) => {
      let body = '';
  
      this.request.on('data', function (chunk) {
          body += chunk;
      });
  
      this.request.on('end', function () {
        resolve(JSON.parse(body))
      });
    })
  }

  endpoint(route, method, func) {
    if (this.isFinded) return true;
    const parseUrl = url.parse(this.request.url, true);
    const parseRoute = url.parse(route, true)

    if (this.checkUrl(parseUrl, parseRoute)
      && this.checkMethod(method)
      && this.checkQuery(parseUrl, parseRoute)) {
      this.isFinded = true;
      if (func) {
        func();
      }
      return true
    }
    return false
  }

  checkUrl(parseUrl, parseRoute) {
    const wordsUrl = parseUrl.pathname.split('/')
    const wordsRoute = parseRoute.pathname.split('/')
    if (wordsUrl.length !== wordsRoute.length) {
      return false
    }
    for (let i = 0; i < wordsUrl.length; i++) {
      const param = wordsUrl[i] && Number(wordsUrl[i])
      if (wordsRoute[i] !== wordsUrl[i]) {
        if (wordsRoute[i][0] !== ':') {
          this.params = []
          return false
        } else {
          this.params.push(param)
        }
      }
    }
    return true
  }

  checkMethod(method) {
    if (method &&
      method.toLowerCase() !== this.request.method.toLowerCase()) {
      return false
    }
    return true
  }

  checkQuery(parseUrl, parseRoute) {
    for (const key of Object.keys(parseRoute.query)) {
      if (!parseUrl.query[key]) {
        return false;
      } else if (
        Number((parseUrl.query[key])) !== NaN &&
        Number((parseRoute.query[key])) === NaN) {
        return false;
      } else if (
        Number((parseUrl.query[key])) === NaN &&
        Number((parseRoute.query[key]) !== NaN)) {
        return false
      }
    }
    if (Object.keys(parseUrl.query).length) {
      this.pagination = {
        limit: Number(parseUrl.query.limit),
        offset: Number(parseUrl.query.offset)
      }
    }
    return true
  }
}

module.exports.baseUrl = function (request, route) {
  const parseUrl = url.parse(request.url, true);
  const parseRoute = url.parse(route, true);
  const wordsUrl = parseUrl.pathname.split('/')
  const wordsRoute = parseRoute.pathname.split('/')
  return wordsUrl[1] === wordsRoute[1]
}
