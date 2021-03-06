'use strict';

const isEmpty = require('lodash.isempty');
const crypto = require('crypto');
const urlParser = require('url');

module.exports = function(url, options) {
  if (options.useSameDir) {
    return '';
  } else {
    const useHash = options.useHash;
    const parsedUrl = urlParser.parse(decodeURIComponent(url));

    let pathSegments = [url];
    if (options.urlMetaData && options.urlMetaData[url]) {
      pathSegments = [options.urlMetaData[url]];
    } else {
      if (parsedUrl && !isEmpty(parsedUrl.pathname)) {
        pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
      }

      if (useHash && !isEmpty(parsedUrl.hash)) {
        const md5 = crypto.createHash('md5'),
          hash = md5
            .update(parsedUrl.hash)
            .digest('hex')
            .substring(0, 8);
        pathSegments.push('hash-' + hash);
      }
    }

    pathSegments.unshift(parsedUrl.hostname.split('.').join('_'));

    pathSegments.unshift('pages');

    // If we have an alias, skip query hash
    if (options.urlMetaData && options.urlMetaData[url]) {
      // Do nada
    } else if (!isEmpty(parsedUrl.search)) {
      const md5 = crypto.createHash('md5'),
        hash = md5
          .update(parsedUrl.search)
          .digest('hex')
          .substring(0, 8);
      pathSegments.push('query-' + hash);
    }

    pathSegments.push('data');

    pathSegments.forEach(function(segment, index) {
      if (segment) {
        pathSegments[index] = segment.replace(
          /[^-a-z0-9_.\u0621-\u064A]/gi,
          '-'
        );
      }
    });

    return pathSegments.join('/').concat('/');
  }
};
