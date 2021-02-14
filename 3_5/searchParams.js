const { URL } = require('url');

const myURL = new URL('https://user:pass@sub.example.com:8080/p/a/t/h?query=string#hash');
console.log('searchParams:' , myURL.searchParams);
console.log('searchParams.getAll():' , myURL.searchParams.getAll('category'));
console.log('searchParams.get():' , myURL.searchParams.get('limtit'));
console.log('searchParams.has():' , myURL.searchParams.has('page'));

console.log('searchParams.keys():' , myURL.searchParams.keys());
console.log('searchParams.values():' , myURL.searchParams.values());

myURL.searchParams.append('filter' , 'es3');
myURL.searchParams.append('filter' , 'es5');
console.log(myURL.searchParams.getAll('filter'));
myURL.searchParams.set('filter' , 'es6');
console.log(myURL.searchParams.getAll('filter'));
myURL.searchParams.delete('filter');
console.log(myURL.searchParams.getAll('filter'));
console.log('searchParams.toString():', myURL.searchParams.toString());
myURL.search = myURL.searchParams.toString();