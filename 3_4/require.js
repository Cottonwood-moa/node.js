console.log('require가 가장 위에 오지 않아도 됩니다.');

module.exports = '저를 찾아보세요';

require('/Users/geon0/OneDrive/바탕 화면/node/3_3/var');

console.log('require.cache입니다.');
console.log(require.cache);
console.log('require.main입니다.');
console.log(require.main);
console.log(require.main.filename);
