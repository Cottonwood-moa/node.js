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
