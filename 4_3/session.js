const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');

const parseCookies = (cookie = '') =>
  cookie
    .split(';')
    .map(v => v.split('='))
    .reduce((acc, [k, v]) => {
      acc[k.trim()] = decodeURIComponent(v);
      return acc;
    }, {});

const session = {};

http.createServer(async (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  if (req.url.startsWith('/login')) {
    const { query } = url.parse(req.url);
    const { name } = qs.parse(query);
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);
    const uniqueInt = Date.now();
    session[uniqueInt] = {
      name,
      expires,
    };
    res.writeHead(302, {
      Location: '/',
      'Set-Cookie': `session=${uniqueInt}; Expires=${expires.toGMTString()}; HttpOnly; Path=/`,
    });
    res.end();
  // 세션쿠키가 존재하고, 만료 기간이 지나지 않았다면
  } else if (cookies.session && session[cookies.session].expires > new Date()) {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`${session[cookies.session].name}님 안녕하세요`);
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
  .listen(8085, () => {
    console.log('8085번 포트에서 서버 대기 중입니다!');
    
  });

  /* cookie2와는 살짝 달라진 부분이 있다.
  쿠키에 이름을 담아서 보내는 대신, uniqueInt 라는 숫자 값을 보냈다.
  이용자의 이름과 만료 시간은 uniqueInt 속성명 아래에 있는 session이라는 객체에 대신 저장한다.
  이제 cookie.session 이 있고 만료 기한을 넘기지 않았다면 session 변수에서 사용자 정보를 가져와 사용한다. 
  다른 부분은 동일하다.

  이 방식이 세션이다. 서버에 사용자 정보를 저장하고 클라이언트와는 세션 아이디로만 소통한다.
  세션 아이디는 꼭 쿠키를 사용해서 주고받지 않아도 된다.
  하지만 많은 웹 사이트가 쿠키를 사용한다.
  쿠키를 사용하는 방법이 제일 간단하기 때문이다.
  이 책에서도 쿠키를 사용해 세션 아이디를 주고받는 식으로 실습을 진행할 것이다.
  세션을 위해 사용하는 쿠키를 세션 쿠키라고 부른다.
  물론 실제 배포용 서버에서는 세션을 위와 같이 변수에 저장하지 않는다.
  서버가 멈추거나 재시작되면 메모리에 저장된 변수가 초기화되기 때문이다.
  또한, 서버의 메모리가 부족하면 세션을 저장하지 못하는 문제도 생긴다.
  그래서 보통은 래디스(Redis)나 멤캐시드(Memcached)같은 데이터베이스에 넣어둔다.
  서비스를 새로 만들 때마다 쿠키와 세션을 직접 구현할 수는 없다.
  게다가 지금 코드로는 쿠키를 악용한 여러 가지 위협을 방어하지도 못한다.
  위의 방식 역시 세션 아이디 값이 공개되어 있어 누출되면 다른 사람이 사용할 수 있다.
  따라서 절대로 위의 코드를 길제 서비스에 사용해서는 안된다.
  위의 코드는 개념을 설명하기 위한 것이며, 보안상 매우 취약하다.
  안전하게 사용하기 위해서는 다른 사람들이 만든 검증된 코드를 사용하는 것이 좋다.
  다른 사람의 코드(모듈)를 사용하는 방법은 5장에서 배운다.
  또 6장에서는 세션을 처리하는 모듈을 사용해 제대로 된 세션 기능을 도입해본다.
  
  */