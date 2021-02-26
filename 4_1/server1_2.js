/* 한 번에 여러 서버를 실행할 수도 있다. crreateServer 를 원하는 만큼 호출하면 된다. */
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write('<h1>Hello Node!</h1>');
  res.end('<p>Hello Server!</p>');
})
  .listen(8080, () => { // 서버 연결
    console.log('8080번 포트에서 서버 대기 중입니다!');
  });

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.write('<h1>Hello Node!</h1>');
  res.end('<p>Hello Server!</p>');
})
  .listen(8080, () => { // 서버 연결
    console.log('8081번 포트에서 서버 대기 중입니다!');
  });

  /* 각각 localhost:8080 과 localhost:8081 주소로 서버에 접속할 수 있다.
  이때 포트 번호가 달라야 한다는 점에 주의한다.
  포트 번호가 같으면 EADDRINUSE 에러가 발생.
  단, 실무에서는 이런 식으로 서버를 여러 개 띄우는 일은 드물다.
  res.write와 res.end 에 일일이 HTML을 적는 것은 비효율적이므로 미리 HTML파일을 만들어 두면 좋을 것이다.
  그 HTML 파일을 fs 모듈로 읽어서 전송할 수 있다. */