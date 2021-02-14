const url = require('url');

const { URL } = url;
const myURL =
  new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
console.log('new URL():', myURL);
console.log('url.format():' , url.format(myURL));
console.log('------------------------------');
const url = require('url');
const parseUrl =
  url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
console.log('url.parse():', parseUrl);
console.log('url.format():', url.format(parseUrl));