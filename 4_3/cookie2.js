//필요한 모듈
const http = require('http'); 
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

/* 
쿠키는 mycookie=test 같은 문자열이다.
이를 쉽게 사용하기 위해 자바스크립트 객체 형식으로 바꾸는 함수이다.
이 함수를 거치면 {mycookie:'test'}가 된다.
내부 내용은 중요하지 않으므로 이해하지 않아도 됩니다.
그저 parseCookies 함수가 문자열을 객체로 바꿔준다고만 알고 있으면 된다.
*/
const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});
/* 
주소가 /login 으로 시작할 경우에는 url과 querystring 모듈로 각각 주소와 주소에 딸려오는 query를 분석한다.
그리고 쿠키의 만료 시간도 지금으로부터 5분 뒤로 설정한다.
이제 302 응답 코드, 리다이렉트 주소와 함께 쿠키를 헤더에 넣는다.
브라우저는 이 응답 코드를 보고 페이지를 해당 주소로 리다이렉트한다.
헤더에는 한글을 설정할 수 없으므로 name 변수를 encodeURLComponent 메서드로 인코딩했다.
또한 Set-Cookie 의 값으로는 제한된 ASCHII 코드만 들어가야 하므로 줄바꿈을 넣으면 안된다.
 */
http.createServer(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie); // { mycookie: 'test' }
  // 주소가 /login으로 시작하는 경우
  if (req.url.startsWith('/login')) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    // 쿠키 유효 시간을 현재시간 + 5분으로 설정
    expires.setMinutes(expires.getMinutes() + 5);
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `name=${encodeURIComponent(name)}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    });
    res.end();

    /* 
    그 외의 경우(/로 접속했을 때 등), 먼저 쿠키가 있는지 없는지를 확인한다.
    쿠키가 없다면 로그인할 수 있는 페이지를 보낸다.
    처음 방문한 경우에는 쿠키가 없으므로 cookie2.html이 전송된다.
    쿠키가 있다면 로그인한 상태로 간주하여 인사말을 보낸다.
     */
  // name이라는 쿠키가 있는 경우
  } else if (cookies.name) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${cookies.name}님 안녕하세요`);
  } else {
    try {
      const data = await fs.readFile('./cookie2.html');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(err.message);
    }
  }
})

  .listen(8084, () => {
    console.log('8084번 포트에서 서버 대기 중입니다!');
  });

  /* 
  Set-Cookie로 쿠키를 설정할 때 만료시간(Exprise)과 HttpOnly, path 같은 옵션을 부여했다.
  쿠키를 설정할 때는 각종 옵션을 넣을 수 있으며, 옵션 사이에 세미콜론(;)을 써서 구분하면 된다.
  쿠키에는 들어가면 안되는 글자들이 있는데, 대표적으로 한글과 줄바꿈이 있다.
  한글은 encodeURLComponent 로 감싸서 넣는다.

  쿠키명 = 쿠기값 : 기본적인 쿠키의 값이다. mycookie=test 또는 name=cottonwood와 같이 설정한다.
  Exprise=날짜 : 만료기한이다. 이 기한이 지나면 쿠키가 제거된다. 기본값은 클라이언트가 종료될 때까지이다.
  Max-age=초 : Exprise와 비슷하지만 날짜 대신 초를 입력할 수 있다. 해당 초가 지나면 쿠키가 제거된다. Exprise보다 우선한다.
  Domain=도메인명 : 쿠키가 전송될 도메인을 특정할 수 있다. 기본값은 현재 도메인이다.
  Path=URL : 쿠키가 전송될 URL을 특정할 수 있다. 기본값은 '/'이고, 이 경우 모든 URL에서 쿠키를 전송할 수 있다.
  Secure : HTTPS일 경우에만 쿠키가 전송된다.
  HttpOnly : 설정 시 자바스크립트에서 쿠키에 접근할 수 없다. 쿠키 조작을 방지하기 위해 설정하는 것이 좋다.
  
  */