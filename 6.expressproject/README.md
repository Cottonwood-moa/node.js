이제 본격적으로 익스프레스 프로젝트를 시작해보자.
먼저 learn-express 폴더를 만든다.
항상 package.json을 제일 먼저 생성해야 한다.
package.json을 생성해주는 npm init 명령어를 콘솔에서 호출해도 되고 직접 파일을 만들어도 된다.
version이나 description, author, license 는 원하는 대로 자유롭게 수정해도 괜찮다.

scripts 부분에 start 속성은 잊지 말고 넣어줘야 한다.
nodemon app을 하면 app.js 를 nodemon으로 실행한다는 뜻이다.
서버 코드에 수정사항이 생길 때마다 매번 서버를 재시작 하기는 귀찮으므로 nodemon 모듈로 서버를 자동으로 재시작한다. 
앞으로 서버 코드를 수정하면 nodemon이 서버를 자동으로 재시작한다. 
nodemon이 실행되는 콘솔에 rs를 입력해서 수동으로 재시작할 수도 있다.

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
app.set('port', 포트)로 서버가 실행될 포트를 설정한다. 
process.env 객체에 PORT속성이 있다면 그 값을 사용하고,
없다면 기본값으로 3000번 포트를 이용하도록 되어 있다. 
이렇게 app.set(키, 값)을 사용해서 데이터를 저장할 수 있다.
나중에 데이터를 app.get(키)로 가져올 수 있다.
app.get(주소, 라우터)는 주소에 대한 GET 요청이 올 때 어떤 동작을 할지 적는 부분이다.
매개변수 req는 요청에 관한 정보가 들어 있는 객체이고, res는 응답에 관한 정보가 들어 있는 객체이다.
현재 GET / 요청 시 응답으로 Hello, Express 를 전송한다. 
익스프레스에서는 res.write나 res.end 대신 res.send 를 사용한다.
GET요청 외에도 POST, PUT, PATCH, DELETE, OPTIONS 에 대한 라우터를 위한 app.post, app.put, app.patch, app.delete, app.options 메서드가 존재한다.
listen을 하는 부분은 http 웹 서버와 동일하다.
4장에서 서버를 구동했던 것과 동일하게 포트를 연결하고 서버를 실행한다.
포트는 app.get('post')로 가져왔다.

단순한 문자열 대신 HTML로 응답하고 싶다면 res.sendFile 메서드를 사용하면 된다.
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
다른 책이나 코드에서 body-parser를 서ㄹ치하는 것을 볼 수도 있다.
하지만 익스프레스 상위버전부터 bodyparser 미들웨어의 일부 기능이 익스프에스에 내장되었으므로 따로 설치할 필요가 없다.
단, body-parser를 직접 설치해야 하는 경우도 있다. body-parser는 JSON과 URL-encoded 형식의 데이터 외에도 Raw, Text 형식의 데이터를 추가로 해석할 수 있다.
Raw는 요청의 본문이 버퍼 데이터일 때, Text는 텍스트 데이터일 때 해석하는 미들웨어이다.
버퍼나 텍스트 요청을 처리할 필요가 있다면 body-parser를 설치한 후 다음과 같이 추가하면 된다.

    npm i body-parser
    
    const bodyParser = require('body-parser');
    app.use(bodyParser.raw());
    app.use(bodyParser.text());

요청 데이터 종류를 간단히 살펴보자 JSON은 JSON형식의 데이터 전달 방식이고, URL-encoded는 주소 형식으로 데이터를 보내는 방식이다.
ulrecoded 메서드를 보면 {extended:false}라는 옵션이 들어 있다.
이 옵션이 false면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석하고, true면 qs 모듈을 사용하여 쿼리스트링을 해석한다.
qs 모듈을 내장 모듈이 아니라 npm 패키지이며, querystring 모듈의 기능을 좀 더 확장한 모듈이다.
POST와 PUT 요청의 본문을 전달받으려면 req.on('data')와 req.on('end')로 스트림을 사용해야 했던 것을 기억할 것이다.
body-parser를 사용하면 그럴 필요가 없다. 이 패키지가 내부적으로 스트림을 처리해 req.body에 추가한다.
예를 들어, JSON 형식으로 {name : 'Cottonwood', book: 'nodejs'}를 본문으로 보낸다면 req.body에 그대로 들어간다. URL-encoded형식으로
name=Cottonwood&book=nodejs를 본문으로 보낸다면 req.body에  {name : 'Cottonwood', book: 'nodejs'} 가 들어간다.

cookie-parser
cookie-parser 는 요청에 동봉된 쿠키를 해석해 req.cookies 객체로 만든다.
parseCookies 함수와 기능이 비슷하다.
cookie-parser 미들웨어는 다음과 같이 사용한다.

    app.use(cookieParser(비밀키));

해석된 쿠키들은 req.cookies 객체에 들어간다.
예를 들어 name=cottonwood 쿠키를 보냈다면 req.cookies는 {name : 'Cottonwood'}가 된다.
유효기간이 지난 쿠키는 알아서 걸러낸다.
첫 번째 인수로 비밀 키를 넣어줄 수 있다. 서명된 쿠키가 있는 경우, 제공한 비밀 키를 통해 해당 쿠키가 내 서버가 만든 쿠키임을 검증할 수 있다.
쿠키는 클라이언트에서 위조하기 쉬우므로 비밀키를 통해 만들어낸 서명을 쿠키 값 뒤에 붙인다. 서명이 붙으면
name=Cottonwood.sign 과 같은 모양이 된다. 서명된 쿠키는 req.cookies 대신 req.sigendCookies 객체에 들어있다.
cookie-parser가 쿠키를 생성할 때 쓰는 것은 아니다. 쿠키를 생성/제거하기 위해서는 res.cookie, res.clearCookie 메서드를 사용해야 한다.
res.cookie(키, 값, 옵션) 형식으로 사용한다.
옵션은 이전에 살펴본 쿠키 옵션과 동일하다.
domain, expires, httpOnly, maxAge, path, secure 등이 있다.

    res.cookie('name', 'zerocho', {
        expires:new Date(Date.now() + 900000),
        httpOnly: true,
        secure:true,
    });
    res.clearCookie('name','Cottonwood',{httpOnly : ture,secure: true});

쿠키를 지우려면, 키와 값 외에 옵션도 정확히 일치해야 쿠키가 지워진다.
단, expires나 maxAge 옵션은 일치할 필요가 없다.
옵션 중에는 signed라는 옵션이 있는데, 이를 true로 설정하면 쿠키 뒤에 서명이 붙는다. 
내 서버가 쿠키를 만들었다는 것은 검증할 수 있으므로 대부분의 경우 서명 옵션을 켜두는 것이 좋다.
서명을 위한 비밀 키는 cookieParser 미들웨어에 인수로 넣은 process.env.COOKIE_SECRET이 있다.

express-session
세션 관리용 미들웨어이다.
로그인 등의 이유로 세션을 구현하거나 특정 사용자를 위한 데이터를 임시적으로 저장해둘 때 매우 유용하다.
세션은 사용자별로 req.session 객체안에 유지된다.

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

express-session 1.5 버전 이전에는 내부적으로 cookie-parser를 사용하고 있어서 cookie-parser 미들웨어 보다 뒤에 위치해야 했지만
1.5 버전 이후부터는 사용하지 않게 되어 순서가 상관없어졌다.
그래도 현재 어떤 버전을 사용하고 있는지 모른다면 cookie-parser 미들웨어 뒤에 놓는 것이 안전하다.

express-session 은 인수로 세션에 대한 설정을 받는다.

resave는 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정하는 것이고, saveUninitialized는 세션에 저장할 내역이 없더라도
처음부터 세션을 설정할지 설정하는 것이다. 현재는 둘 다 필요 없으르모 false 로 했다.
express-session 은 세션 관리 시 클라이언트에 쿠키는 보낸다. 4.3절에서 배운 세션 쿠키가 이것이다.
안전하게 쿠키를 전송하려면 쿠키에 서명을 추가해야 하고, 쿠키를 서명하는데 secret의 값이 필요하다.
cookie-parser의 secret과 같게 설정하는 것이 좋다. 세션 쿠키의 이름은 name 옵션으로 설정한다. 기본 이름은 connect.sid 이다.
cookie 옵션은 세션 쿠키에 대한 설정이다. maxAge, domain, path, expires, sameSite, httpOnly, secure등 일반적인 쿠키 옵션이 모두 제공된다.
현재 httpOnly를 true로 설정해 클라이언트에서 쿠키를 확인하지 못하도록 했고, secure는 false로 해서 http가 아닌 환경에서도 사용할 수 있게 했다.
배포시에는 https를 적용하고 secure도 true로 설정하는 것이 좋다.
예제 코드에는 나와 있지 않지만 , store라는 옵션도 있다.
현재는 메모리에 세션을 저장하도록 되어 있다.
문제는 서버를 재시작하면 메모리가 초기화되어 세션이 모두 사라진다는 것이다.
따라서 배포 시에는 store에 데이터베이스를 연결하여 세션을 유지하는 것이 좋다.
보통 레디스가 자주 쓰인다ㅏ. 레디스의 사용 방법은 15.1.8절에서 설명한다.

    req.session.name='Cottonwood';//세션등록
    req.session.ID;//세션 아이디 확인
    req.session.detory();//세션 모두 제거

express-session 으로 만들어진 req.session 객체에 값을 개입하거나 삭제해서 세션을 변경할 수 있다.
나중에 세션을 한 번에 삭제하려면 req.session.destory 메서드를 호출하면 된다.
현재 세션의 아이디는 req.sessionID로 확인할 수 있다. 
세션을 강제로 저장하기 위해 req.session.save 메서드가 존재하지만, 일반적으로 요청이 끝날 떄 자동으로 호출되므로 직접 save메서드를 호출할 일은 거의 없다.
실제 로그인은 9.3절에서 하지만, 세션 쿠키의 모양이 조금 독특하니 미리 알아두면 좋다.
express-session에서 서명한 쿠키 앞에는 s:이 붙는다.
실제로는 encodedURIComponent 함수가 실행되어 value가 된다.
value 부분이 실제 암호화된 쿠키 내용이다.
앞에 s%3A 가 붙은 경우, 이 쿠키가 express-session 미들웨어에 의해 암호화된 것이라고 생각하면 된다.

미들웨어 특성 활용하기
미들웨어를 직접 만들어보기도 했고, 다른 사람이 만든 미들웨어 패키지를 설치해 장착해보기도 했다.
이번 절에서 미들웨어의 특성을 총정리 해보자.

    app.use((req,res,next=>{
        console.log('모든 요청에 다 실행됩니다.');
        next();
    }));

미들웨어는 req,res,next를 매개변수로 가지는 함수(에러 처리 미들웨어만 예외적으로 err,req,res,next를 가진다.)
로서 app.use, app.get, app.post 등으로 장착한다. 특정한 주소의 요청에만 미들웨어가 실행되게 하려면 첫 번째 인수로 주소를 넣으면 된다.

    app.use(
        morgan('dev'),
        express.static('/',path.join(__dirname, 'public')),
        express.json(),
        express.urlencoded({extended: false}),
        cookieParser(process.env.COOKIE_SECRET),
    )

위와 같이 동시에 여러 개의 미들웨어를 장착할 수도 있으며, 다음 미들웨어로 넘어가려면 next함수를 호출해야 한다.
위 미들웨어들은 내부적으로 next를 호출하고 있으므로 연달아 쓸 수 있다.
next를 호출하지 않는 미들웨어는 res.send나 res.sendFile 등의 메서드로 응답을 보내야한다.
express.static과 같은 미들웨어는 정적 파일을 제공할 때 next대신 res.sendFile 메서드로 응답을 보내야 한다. 
따라서 정적 파일을 제공하는 경우 express.json, express.urlencoded, cookieParser 미들웨어는 실행되지 않는다.
미들웨어 장착 순서에 따라 어떤 미들웨어는 실행되지 않을 수도 있다는 것을 기억해두자.
만약 next도 호출하지 않고 응답도 보내지 않으면 클라이언트는 응답을 받지 못해 하염없이 기다리게 된다.

image(그림판)

지금까지는 next에 아무런 인수를 넣지 않았지만 next 함수에 인수를 넣을 수도 있다.
단, 인수를 넣는다면 특수한 동작을 한다.
route라는 문자열을 넣으면 다음 라우터의 메들웨어로 바로 이동하고 , 그 외의 인수를 넣는다면
바로 에러 처리 미들웨어로 이동한다. 이때의 인수는 에러처리 미들웨어의 err 매개변수가 된다.
라우터에서 에러가 발생할 때 에러를 next(err)을 통해 에러처리 미들웨어로 넘긴다.
미들웨어 간에 데이터를 전달하는 방법도 있다.
세션을 사용한다면 req.session 객체에 데이터를 넣어도 되지만, 세션이 유지되는 동안에 데이터도 계속 유지된다는 단점이 있다.
만약 요청이 끝날 때까지만 데이터를 유지하고 싶다면 req 객체에 데이터를 넣어두면 된다.

    app.use((req,res,next)=>{
        req.data = '데이터 넣기';
        next();
    },(req,res,next)=>{
        console.log(req.data);
        next();
    });

현재 요청이 처리되는 동안 req.data를 통해 미들웨어 간에 데이터를 공유할 수 있다.
새로운 요청이 오면 req.data는 초기화된다. 속성명이 꼭 data일 필요는 없지만 다른 미들웨어와 겹치지 않게 조심해야 한다.
예를 들어 속성명을 body로 한다면 (req.body)body-parser 미들웨어와 기능이 겹치게 된다.

    app.set과의 차이
    app.set으로 익스프레서에서 데이터를 저장할 수 있다는 것을 배웠다.
    app.get 또는 req.app.get 으로 어디서든지 데이터를 가져올 수 있다.
    하지만 app.set을 사용하지 않고 req객체에 데이터를 넣어서 다음 미들웨어로 전달하는 이유가 있다.
    app.set은 익스프레스에서 전역적으로 사용되므로 사용자 개개인의 값을 넣기에는 부적절하며 , 앱 전체의 설정을 공유할 때 사용하면 된다.
    req 객체는 요청을 보낸 사용자 개개인에게 귀속되므로 req 객체를 통해 개인의 데이터를 전달하는 것이 좋다.

미들웨어를 사용할 때 유용한 패턴 한 가지를 소개한다.
미들웨어 안에 미들웨어를 넣는 방식이다. 다음 예제의 두 방식은 같은 기능을 한다.

    app.use(morgan('dev'));
    //또는
    app.use((req,res,next)=>{
        morgan('dev')(req,res,next);
    });

이 패턴이 유용한 이유는 기존 미들웨어의 기능을 확장할 수 있기 때문이다.
예를 들어 다음과 같이 분기 처리를 할 수도 있다. 조건문에 따라 다른 미들웨어를 적용하는 코드이다.

    app.use((req,res,next)=>{
        if(process.env.NODE_ENV === 'production'){
            morgan('combined')(req,res,next);
        }else{
            morgan('dev')(req,res,next);
        }
    });

앞으로 살펴볼 예제에서 위와 같은 패턴을 사용하는 경우를 볼 수 있다.

multer
이번에는 사용하는 방법이 다소 어려운 미들웨어를 알아보자.
이미지, 동영상 등을 비롯한 여러 가지 파일들을 멀티파트 형식으로 업로드할 때 사용하는 미들웨어이다.
멀티파트 형식이란 enctype이 multipart/form-data 인 폼을 통해 업로드하는 데이터의 형식을 의미한다.

멀티파트 형식으로 업로드하는 데이터는 개발자 도구 Network 탭에서 볼 수 있다.
이러한 폼을 통해 업로드하는 파일은 body-parser로는 처리할 수 없고 직접 파싱(해석)하기도 어려우므로
multer 라는 미들웨어를 따로 사용하면 편리하다. multer를 설치하자

    npm i multer

multer 패키지 안에는 여러 종류의 미들웨어가 들어 있다.
미들웨어를 살펴보기 전에 기본적인 설정부터 알아보자.

    const multer = require('multer');
    const upload = multer({
        storage:multer.diskStorage({
            destination(req,file,done){
                done(null,'uploads/');
            },
            filename(req,file,done){
                const ext = path.extname(file.originalname);
                done(null, paht.basename(file.originalname, ext)+ Date.now() + ext);
            },
        }),
        limits:{fileSize:5 * 1024 * 1024},
    });

multer함수의 인수로 설정을 넣는다. storage 속성에는 어디에(destination)어떤 이름으로(filename)저장할지를 넣었다.
destination 과 filename 함수의 req 매개변수에는 요청에 대한 정보가, file 객체에는 업로드한 파일에 대한 정보가 있다.
done 매개변수는 함수이다. 첫 번째 인수에는 에러가 있다면 에러를 넣고, 두 번째 인수에는 실제 경로나 파일 이름을 넣어주면 된다.
req나 file의 데이터를 가공해서 done으로 넘기는 형식이다.

현재 설정으로는 uploads라는 폴더에 [파일명+현재시간.확장자]파일명으로 업로드하고 있다.
현재 시간을 넣어주는 이유는 업로드하는 파일명이 겹치는 것을 막기 위해서이다.
limits 속성에는 업로드에 대한 제한 사항을 설정할 수 있다.
파일 사이즈(fileSize, 바이트 단위)는 5MB로 제한했다.
다만 위 설정을 실제로 활용하기 위해서는 서버에 uploads 폴더가 꼭 존재해야 한다.
없다면 직접 만들어주거나 다음과 같이 fs모듈을 사용해서 서버를 시작할 때 생성해야 한다.

    const fs = requier('fs');

    try{
        fs.readdirSync('uploads');
    }catch(error){
        console.error('upload폴더가 없어 uploads 폴더를 생성합니다.');
        fs.mkdirSync('uploads');
    }

설정이 끝나면 upload 변수가 생기는데, 여기에 다양한 종류의 미들웨어가 들어 있다.
먼저 파일을 하나만 업로드 하는 경우 (multipart.html과 같은 경우)에는 single 미들웨어를 사용한다.

    app.post('/upload', upload.single('image'),(req,res)=>{
        console.log(req.file,req.body);
        res.send('ok');
    });

single 미들웨어를 라우터 미들웨어 앞에 넣어두면, multer 설정에 따라 파일 업로드 후 req.file 객체가 생성된다. 인수는 input 태그의 name 이나 폼 데이터의 키와 일치하게 넣으면 된다.
업로드 성공시 결과는 req.file 객체 안에 들어있다. req.body에는 파일이 아닌 데이터인 title이 들어 있다.

여러 파일을 업로드하는 경우 HTML의 input 태그에는 multiple 을 쓰면 된다.
미들웨어는 single 대신 array로 교체한다.

   app.post('/upload', upload.array('many'),(req,res)=>{
        console.log(req.file,req.body);
        res.send('ok');
    });
업로드 결과도 req.file 대신 req.files 배열에 들어있다.
파일을 여러 개 업로드하지만 input 태그나 폼 데이터의 키가 다른 경우에는 fields 미들웨어를 사용한다.

Router 객체로 라우팅 분리하기