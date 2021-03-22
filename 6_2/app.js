const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
  name: 'session-cookie',
}));

const multer = require('multer');
const fs = require('fs');

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads/');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'multipart.html'));
});
app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('ok');
});

app.get('/', (req, res, next) => {
  console.log('GET / 요청에서만 실행됩니다.');
  next();
}, (req, res) => {
  throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});

/* 
설치했던 패키지들을 불러온 뒤 app.use 에 연결한다.
req res next 같은 것들이 보이지 않아 당황스러울 수 있는데
미들웨어 내부에 들어있다.
next도 내부적으로 호출하가에 다음 미들웨어로 넘어갈 수 있다.

dotenv 패키지는 .env 파일을 읽어서 process.env호 만든다.
dotenv 패키지의 이름이 dot(점) + env 인 이유이다.
process.env.COOKIE_SECRET에 cookiesecret 값이 할당된다.
키=값 형식으로 추가하면 된다. process.env 를 별도의 파일로 관리하는 이유는 보안과 설정의 편의성 때문이다.
비밀 키들을 소스 코드에 그대로 적어두면 소스 코드가 유출되었을 때 키도 같이 유출된다.
따라서 env 같은 별도의 파일에 비밀 키를 적어두고 dotenv패키지로 비밀 키를 로딩하는 방식으로 관리하곤 한다.
소스 코드가 유출되더라도, .env 파일만 잘 관리하면 비밀 키는 지킬 수 있다.

각각의 미들웨어를 살펴보자.

1.morgan
morgan 연결 후 localhost : 3000 에 다시 접속해보면 기존 로그 외에 추가적인 로그를 볼 수 있다.
현재 콘솔에 나오는 GET / 500 7.409ms -50 로그는 morgan 미들웨어에서 나오는 것이다.
요청과 응답에 대한 정보를 콘솔에 기록한다.
morgan 미들웨어는 다음과 같이 사용한다.
 app.use(morgan('dev'));
인수로 dev 외에 combined, common, short, tiny 등을 넣을 수 있다.
인수를 바꾸면 로그가 달라지니 직접 테스트해보자.
필자는 개발환경에서는 dev를 배포 환경에서는 combined 를 애용한다.
dev 모드 기준으로 GET / 500 7.409ms - 50 은 각각 [HTTP 메서드][주소][HTTP 상태 코드][응답속도]-[응답바이트]를 의미한다. 요청과 응답을 한눈에 볼 수 있어 편리하다.

2.static
static 미들웨어는 정적인 파일들을 제공하는 라우터 역할을 한다.
기본적으로 제공되기에 따로 설치할 필요 없이 express 객체 안에서 꺼내 장착하면 된다.
다음과 같이 사용한다.
  app.use('요청경로', express.static('실제경로'));
  app.use('/',express.static(path.join(__dirname, 'public')));
함수의 인수로 정적 파일들이 담겨 있는 폴더를 지정하면 된다.
현재 public 폴더가 지정되어 있다.
예를 들어 public/stylesheets/style.css 는
http://localhost:3000/sytlesheets/style.css 로 접근할 수 있다.
public 폴더를 만들고 css 나 js 이미지 파일들을 public 폴더에 넣으면 브라우저에서 접근할 수 있게 된다.
실제 서버의 폴더 경로에는 public 이 들어 있지만, 요청 주소에는 public 이 들어 있지 않다는 점을 주목하자.
서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉽게 파악할 수 없다.
이는 보안에 큰 도움이 된다.
또한, 정적 파일들을 알아서 제공해주므로 4.3절처럼 fs.readFile 로 파일을 직접 읽어서 전송할 필요가 없다.
만약 요철 경로에 해당하는 파일이 없으면 알아서 내부적으로 next 를 호출한다.
만약 파일을 발견했다면 다음 미들웨어는 실행되지 않는다. 응답으로 파일을 보내고 next를 호출하지 않기 떄문이다.


3.body-parser
요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어이다.
보통 폼 데이터나 AJAX 요청의 데이터를 처리한다. 단, 멀티파트(이미지 동영상 파일)데이터는 처리하지 못한다.
그 경우에는 뒤에 나오는 multer 모듈을 사용하면 된다.
body-parser 미들웨어는 다음과 같이 사용한다.
  app.use(express.jseon());
  app.use(express.urlencoded({extend:false}));
다른 책이나 코드에서 body-parser를 설치하는 것을 볼 수도 있다.
하지만 express 상위버전부터 body_parser 미들웨어의 일부 기능이 익스프레스에 내장되었으므로 따로 설치할 필요가 없다.
단, body=parser 를 직접 설치해야 하는 경우도 있다.
body-parser는 JSON과 URL-encoded 형식의 데이터 외에도 Raw, Text 형식의 데이터를 추가로 해석할 수 있다.
RAW는 요청의 본문이 버퍼 데이터일 때, Text 는 텍스트 데이터일 때 해석하는 미들웨어 이다.
버퍼나 텍스트 요청을 처리할 필요가 있다면 body-parser를 설치한 후 다름과 같이 추가한다.

  npm i body-parser

  const bodyparser = requier('body-parser');
  app.use(bodyParser.raw());
  app.use(bodyParser.text());

요청 데이터 종류를 간단히 살펴보자.
JSON은 JSON 형식의 데이터 전달 방식이고, URL-excoded 는 주소 형식으로 데이터를 보내는 방식이다.
폼 전송은 URL-encoded 방식을 주로 사용한다.
urlencoded 메서드를 보면 {extends: false}라는 옵션이 들어 있다.
이 옵션이 false 면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, true 면 qs 모듈을 사용하여 쿼리스트링을 해석한다.
qs 모듈은 내장 모듈이 아니라 npm 패키지이며, querystring 모듈의 기능을 좀 더 확장한 모듈이다.
4.2 절에서 POST 와 PUT 요청의 본문을 전달받으려면 req.on('data')와 req.on('end')로 스트림을 사용해야 했던 것을 기억할 것이다.
body-parser를 사용하면 그럴 필요가 없다.
이 패키지가 내부적으로 스트림을 처리해 req.body 에 추가한다.
예를 들어, JSON의 형식으로 {name : 'cottonwood', book:'nodejs'}를 본문으로 보낸다면 req.body에 그대로 들어간다.
URL-encoded 형식으로 name=cottonwood&book=nodejs 를 본문으로 보낸다면 req.body 에 {name : 'cottonwood', book:'nodejs'}가 들어간다.

4.cookie-parser
cookie-parser 는 요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만든다.
4.3절의 parseCookies 함수와 기능이 비슷하다.
cookie-parser 미들웨어는 다음과 같이 사용한다.
  app.use(cookieParser(비밀키));
해석된 쿠키들을 req.cookies 에 들어간다.
예를들어 name = cottonwood 쿠키를 보냈다면 req.cookies는 {name : cottonwood}가 된다.
유효기간이 지난 쿠키는 알아서 걸러낸다.
첫 번째 인수로 비밀 키를 넣어줄 수 있다. 서명된 쿠키가 있는 경우, 제공한 비밀 키를 통해 해당 쿠키가 내 서버가 만든 쿠키임을 증명할 수 있다.
쿠키는 클라이언트가 위조하기 쉬우므로 비밀 키를 통해 만들어낸 서명을 쿠키 값 뒤에 붙인다. 서명이 붙으면 쿠키가 name = cottonwood.sign 과 같은 모양이 된다.
서명된 쿠키는 req.cookies 대신 req.signedCookies 객체에 들어 있다.
cookie-parser 가 쿠키를 생성할 때 쓰이는 것은 아니다.쿠키를 생성/제거하기 위해서는 res.cookie res.clearCookie 메서드를 사용해야 한다.
res.cookie(키, 값, 옵션)형식으로 사용한다. 옵션은 4.3절에서 살펴본 쿠키 옵션과 동일하다.
domainm expiresm httpOnly, maxAge, path, secure 등이 있다.

  res.cookie('name', 'cottonwood', {
    expires: new Date(Date.now() + 900000),
    httpOnly: true,
    secure: true,
  });
  res.clearCookie('name' , 'cottonwood', {httpOnly: true, secure : true});

쿠키를 지우려면, 키와 값 외에 옵션도 정확히 일치해야 쿠키가 지워진다.
단, expires 나 maxAge 옵션은 일치할 필요가 없다.
옵션 중에는 signed 라는 옵션이 있는데, 이를 true 로 설정하면 쿠키 뒤에 서명이 붙는다. 내 서버가 쿠키를 만들었다는 것은 검증할 수 있으므로 대부분의 경우 서명 옵션을 켜두는 것이 좋다.
서명을 위한 비밀 키는 cookieParser 미들웨어에 인수로 넣은 process.env.COOKIE_SECRET이 된다.

5.express-session
세션관리용 미들웨어이다. 로그인 들의 이유로 세션을 구현하거나 특정 사용자를 위한 데이터를 임시적으로 저장해둘 때 매우 유용하다.
세션은 사용자별로 req.session 객체 안에 유지된다.
  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    name: 'session-cookie',
  }));
express-session 1.5 버전 이전에는 내부적으로 cookie-parser 를 사용하고 있어서 cookie-parser 미들웨어보다 뒤에 위치해야 했지만,
1.5 버전 이후부터는 사용하지 않게 되어 순서가 상관없어졌다.
그래도 현재 어떤 버전을 사용하고 있는지 모른다면 cookie-parser 미들웨어 뒤에 놓는 것이 안전하다.

express-session 은 인수로 세션에 대한 설정을 받는다.
resave 는 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정하는 것이고, saveUninitalized는 세션에 저장할 내역이 없더라도
처음부터 세션을 생성할지 설정하는 것이다. 현재는 둘다 필요 없으므로 false로 했다.
express-session 은 세션 관리 시 클라이언트에 쿠키를 보낸다. 
4.3절에서 배운 세션 쿠키가 이것이다.
안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는 데 secret의 값이 필요하다.
cookie-parser 의 secret과 같게 설정하는 것이 좋다.
세션 쿠키의 이름은 name 옵션으로 설정한다. 기본 이름은 connect.sid이다.

중략

6.미들웨어 특성 활용하기

7.multer

  */

