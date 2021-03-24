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
