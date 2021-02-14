//노드에서 this를 사용할 때 주의해야 할 점이 있다.


console.log(this);
console.log(this === module.exports);
console.log(this === exports);
function whatIsThis() {
    console.log('function', this === exports , this === global);
}
whatIsThis();

// 다른 부분은 브라우저의 자바스크립트와 동일하지만 최상위 스코프에 존재하는 this는 module.exports(또는 exports 객체)를 가리킨다.
// 또한, 함수 선언문 내부의 this는 global 객체를 가리킨다.