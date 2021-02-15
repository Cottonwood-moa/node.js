const url = require('url');
const querystring = require('querystring');

const parseUrl = url.parse('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
const query = querystring.parse(parseUrl.query);
console.log('querystring.parse():',query);
console.log('querystring.stringfy():', querystring.stringify(query));
