const https = require('https');
const fs = require('fs');

https.createServer({
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
  다른 것은 거의 비슷하지만 createServer 메서드가 인수를 두 개 받는다.
  두 번째 인수는 http 모듈과 같이 서버 로직이고, 첫 번째 인수는 인증서에 관련된 옵션 객체이다.
  인증서를 구입하면 pem이나 crt, 또는 key확장자를 가진 파일들을 제공한다.
  파일들을 fs.readFileSync 메서드로 읽어서 cert,key,ca 옵션에 알맞게 넣으면 된다.
  실제 서버에서는 80 포트 대신 443 포트를 사용하면 된다.
  
  */