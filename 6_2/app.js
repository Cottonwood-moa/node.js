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
  */
