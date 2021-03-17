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

*/