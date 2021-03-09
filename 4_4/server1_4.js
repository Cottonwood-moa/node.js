/* 
노드의 http2 모듈은 SSL 암호화와 더불어 최신 HTTP 프로토콜인 http/2를 사용할 수 있게 한다.
http/2 는 요청 및 응답 방식이 기존 http/1.1 보다 개선되어 훨씬 효율적으로 요청을 보낸다.
http/2를 사용하면 웹의 속도도 많이 개선된다.
다음은 http2 를 적용한 server1-4이다.
*/

const http2 = require('http2');
const fs = require('fs');

http2.createSecureServer({
  cert: fs.readFileSync('도메인 인증서 경로'),
  key: fs.readFileSync('도메인 비밀키 경로'),
  ca: [
    fs.readFileSync('상위 인증서 경로'),
    fs.readFileSync('상위 인증서 경로'),
  ],
}, (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write('<h1>Hello Node!</h1>');
  res.end('<p>Hello Server!</p>');
})
  .listen(443, () => {
    console.log('443번 포트에서 서버 대기 중입니다!');
  });

  /* 
  http 모듈과 거의 유사하다.
  http 모듈은 http2로,
  createServer 메서드를 createSecureServer 메서드로 바꾸면 된다.
  */