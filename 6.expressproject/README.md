이제 본격적으로 익스프레스 프로젝트를 시작해보자.
먼저 learn-express 폴더를 만든다.
항상 package.json을 제일 먼저 생성해야 한다.
package.json을 생성해주는 npm init 명령어를 콘솔에서 호출해도 되고 직접 파일을 만들어도 된다.
version이나 description, author, license 는 원하는 대로 자유롭게 수정해도 괜찮다.

scripts 부분에 start 속성은 잊지 말고 넣어줘야 한다.
nodemon app을 하면 app.js 를 nodemon으로 실행한다는 뜻이다.
서버 코드에 수정사항이 생길 때마다 매번 서버를 재시작 하기는 귀찮으므로 nodemon 모듈로 서버를 자동으로 재시작한다. 앞으로 서버 코드를 수정하면
nodemon이 서버를 자동으로 재시작한다. nodemon이 실행되는 콘솔에 rs를 입력해서 수동으로 재시작할 수도 있다.

nodemon은 개발용으로만 사용하는 것이다.
배포 후에는 서버 코드가 빈번하게 변경될 일이 없으므로 nodemon을 사용하지 않아도 된다.
서버의 역할을 할 app.js를 다음과 같이 적는다.

    const express = require('express');

    const app = express();
    app.set('port',process.env.PORT||3000);

    app.get('/',(req,res)=>{
        res.send('Hello, Express');
    });

    app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기중');
    });

Express 모듈을 실행해 app 변수에 할당한다.
익스프레스 내부에 http 모듈이 내장되어 있으므로 서버의 역할을 할 수 있다.
app.set('port', 포트)로 서버가 실행될 포트를 설정한다. process.env 객체에 PORT속성이 있다면 그 값을 사용하고,
없다면 기본값으로 3000번 포트를 이용하도록 되어 있다. 이렇게 app.set(키, 값)을 사용해서 데이터를 저장할 수 있다.
나중에 데이터를 app.get(키)로 가져올 수 있다.
app.get(주소, 라우터)는 주소에 대한 GET 요청이 올 때 어떤 동작을 할지 적는 부분이다.
매개변수 req는 요청에 관한 정보가 들어 있는 객체이고, res는 응답에 관한 정보가 들어 있는 객체이다.
현재 GET / 요청 시 응답으로 Hello, Express 를 전송한다. 익스프레스에서는 res.write나 res.end 대신 res.send 를 사용한다.
GET요청 외에도 POST, PUT, PATCH, DELETE, OPTIONS 에 대한 라우터를 위한 app.post, app.put, app.patch, app.delete, app.options 메서드가 존재한다.
listen을 하는 부분은 http 웹 서버와 동일하다.
4장에서 서버를 구동했던 것과 동일하게 포트를 연결하고 서버를 실행한다.
포트는 app.get('post')로 가져왔다.

단순한 문자열 대신 HTML로 응갑하고 싶다면 res.sendFile 메서드를 사용하면 된다.
단, 파일의 경로를 path 모듈을 사용해서 지정해야 한다.

    <html>
    <head>
    <meta charset="UTF-8" />
    <title>익스프레스 서버</title>
    </head>
    <body>
    <h1>익스프레스</h1>
    <p>배워봅시다.</p>
    </body>
    </html>

이제 익스프레스 서버에 다양한 기능을 추가해보자.

미들웨어는 익스프레스의 핵심이다.
요청과 응답의 중간에 위치하여 미들웨어라고 부른다.
뒤에 나오는 라우터와 에러 핸들러 또한 미들웨어의 일종이므로 미들웨어가 익스프레스의 전부라고 해도 과언이 아니다.
미들웨어는 요청과 응답을 조작하여 기능을 추가하고, 나쁜 요청을 걸러내기도 한다.
미들웨어는 app.use와 함께 사용된다.app.use(미들웨어)꼴이다. 익스프레스 서버에 미들웨어를 연결해보자.

    const express = require('express');
    const path = require('path');

    const app = express();
    app.set('port',process.env.PORT||3000);

    app.use((req, res, next)=>{
        console.log('모든 요청에 다 실행된됩니다.');
        next();
    });

    app.get('/',(req,res,next)=>{
        // res.sendFile(path.join(__dirname, '/index.html'));
        console.log('GET / 요청에서만 실행됩니다.');
        next();
    },(req,res)=>{
        throw new Error('에러는 에러 처리 미들웨어로 갑니다.');
    });

    app.use((err, req, res, next)=>{
        console.error(err);
        res.status(500).send(err.message);
    });

    app.listen(app.get('port'), ()=>{
    console.log(app.get('port'), '번 포트에서 대기중');
    });

app.use에 매개변수가 req, res, next 인 함수를 넣으면 된다.
미들웨어는 위에서부터 아래로 순서대로 실행되면서 요철과 응답 사이에 특별한 기능을 추가할 수 있다.
이번에는 next라는 세 번째 매개변수를 사용했는데, 다음 미들웨어로 넘어가는 함수이다.
next를 실행하지 않으면 다음 미들웨어가 실행되지 않는다.

주소를 첫 번째 인수로 넣어주지 않는다면 미들웨어는 모든 요청에서 실행되고,
주소를 넣는다면 해당하는 요청에서만 실행된다고 보면 된다.

app.use(미들웨어) => 모든 요청에서 미들웨어 실행
app.use('/abc', 미들웨어) => abc로 시작하는 요청에서 미들웨어 실행
app.post('/abc',미들웨어) => abc로 시작하는 POST요청에서 미들웨어 실행

app.use 나 app.get 같은 라우터에 미들웨어를 여러 개 장착할 수 있다.
현재 app.get 라우터에 미들웨어가 두 개 연결되어 있다.
다만 이때도 next를 호출해야 다음 미들웨어로 넘어갈 수 있다.

현재 app.get('/')의 두 번째 미들웨어에서 에러가 발생하고 , 이 에러는 그 아래에 있는 에러 처리 미들웨어에 전달된다.

에러 처리 미들웨어는 매개변수가 err,req,res,next 로 네 개이다. 모든 매개변수를 사용하지 않더라도 매개변수가 반드시 네 개여야 한다.
첫 번째 매개변수 err에는 에러에 관한 정보가 담겨있다.
res.status 메서드로 HTTP 상태 코드를 지정할 수 있다.
기본값은 200 (성공)이다. 에러 처리 미들웨어를 직접 연결하지 않아도 기본적으로 익스프레스가 에러를 처리하긴 한다.
하지만 실무에서는 직접 에러 처리 미들웨어를 연결해주는 것이 좋다.
에러 처리 미들웨어는 특별한 경우가 아니면 가장 아래에 위치하도록 한다.

미들웨어를 통해 요청과 응갑에 다양한 기능을 추가할 수 있고,
이미 많은 사람이 유용한 기능들을 패키지로 만들어두었다.
실무에 자주 사용하는 패키지들을 설치해보자.

    const express = require('express');
    const morgan = require('morgan');
    const cookieParser = require('cookie-parser');
    const session = require('express-session');
    const dotenv = require('dotenv');
    const path = require('path');

    dotenv.config();

    //포트지정
    const app = express();
    app.set('port',process.env.PORT||3000);

    app.use(morgan('dev'));
    app.use('/',express.static(path.join(__dirname, 'public')));
    app.use(express.json());
    app.use(express.urlencoded({extended:false}));
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie:{
            httpOnly:true,
            secure:false,
        },
        name:'session-cookie'
    }));

    .
    .
    .

설치했던 패키지들을 불러온 뒤 app.use에 연결한다.
req, res, next 같은 것들이 보이지 않아 당황스러울 수도 있는데,
미들웨어 내부에 들어 있다.
next도 내부적으로 호출하기에 다음 미들웨어로 넘어갈 수 있다.
dotenv 패키지는 .env 파일을 읽어서 process.env 로 만든다.
dotenv 패키지의 이름이 dot + env 인 이유이다.
process.env.COOKIE_SECRET에 cookiesecret 값이 할당된다.
키=값 형식으로 추가하면 된다. process.env를 별도의 파일로 관리하는 이유는 보안과 설정의 편의성 때문이다.
비밀 키들을 소스 코드에 그대로 적어두면 소스 코드가 유출되었을 때 키도 같이 유출된다.
따라서 env 같은 별도의 파일에 비밀 키를 적어두고 dotenv 패키지로 비밀키를 로딩하는 방식으로 관리하곤 한다.
소스 코드가 유출되더라도 .env 파일만 잘 관리하면 비밀 키는 지킬수 있다.
각각의 미들웨어를 살펴보자.

morgan
morgan 연결 후 localhost:3000에 다시 접속해보면 기존 로그 외에 추가적인 로그를 볼 수 있다.
    GET / 500 13.635 ms - 50
    모든 요청에 다 실행됩니다.
    GET /favicon.ico 404 4.458 ms - 150
현재 콘솔에 나오는 GET / 500 7.409 - 50 로그는 morgan 미들웨어에서 나오는 것이다.
요청과 응갑에 대한 정보를 콘솔에 기록한다.
morgan 미들웨어는 다음과 같이 사용한다.

    app.use(morgan('dev'));

인수로 dev 외에 combined, common, short, tiny 등을 넣을 수 있다.
인수를 바꾸면 로그가 달라지니 직접 테스트 해보자.
저자는 개발 환경에서는 dev를 , 배포 환경에서는 combined 를 애용한다.
dev 모드 기준으로 GET / 500 7.409 ms -50 은 각각 [HTTP메서드][주소][HTTP상태코드][응답속도]-[응답바이트]를 의미한다.
요청과 응답을 한눈에 볼 수 있어 편리하다.

static
static 미들웨어는 정적인 파일들을 제공하는 라우터 역할을 한다.
기본적으로 제공되기에 따로 설치할 필요 없이 express 객체 안에서 꺼내 장착하면 된다.
다음과 같이 사용한다.

    app.use('요청경로', express.static('실제 경로'));

    app.use('/', express.static(path.join(__dirname, 'public')));

함수의 인수로 정적 파일들이 담겨 있는 폴더를 지정하면 된다.
예를들어 public/stylesheets/style.css 는 http://localhost:3000/stylesheets/style.css로 접근할 수 있다.
public 폴더를 만들고 css나 js, 이미지 파일들을 public 폴더에 넣으면 브라우저에서 접근할 수 있게 된다.
실제 서버의 폴더 경로에는 public이 들어 있지만, 요청 주소에는 public이 들어있지 않다는 점을 주목하자.
서버의 폴더 경로와 요청 경로가 다르므로 외부인시 서버의 구조를 쉽게 파악할 수 없다. 이는 보안에 큰 도움이 된다.
또한, 정적 파일들을 알아서 제공해주므로 fs.readFile로 파일을 직접 읽어서 전송할 필요가 없다.
만약 요청 경로에 해당하는 파일이 없으면 알아서 내부적으로 next를 호출한다.
만약 파일을 발견했다면 다음 미들웨어는 실행되지 않는다. 응답으로 파일을 보내고 next를 호출하지 않기 때문이다.

body-parser
요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어이다.
보통 폼 데이터나 AJAX 요청의 데이터를 처리한다.
단 멀티파트(이미지,동영상,파일) 데이터는 처리하지 못한다.
그 경우에는 뒤에 나오는 multer 모듈을 사용하면 된다.
body-parser 미들웨어는 다음과 같이 사용하면 된다.
    app.use(expression.json());
    app.use(express.urlencoded({extended:false}));
