const express = require('express');

const app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', (req,res)=>{
    res.send('Hello, Express');
});

app.listen(app.get('port'), ()=>{
    console.log(app.get('port', '번 포트에서 대기 중'));
});

/* 
Express 모듈을 실행해 app 변수에 할당한다.
익스프레스 내부에 http 모듈이 내장되어 있으므로 서버의 역할을 할 수 있다.
app.set('port',포트)로 서버가 실행될 포트를 설정한다.
process.env 객체에 PORT 속성이 있다면 그 값을 사용하고, 없다면 기본값으로 3000포트를 이용하도록 되어 있다.
이렇게 app.set(키,값)을 사용해서 데이터를 저장할 수 있다.
나중에 데이터를 app.get(키)로 가져올 수 있다.

app.get(주소,라우터)는 주소에 대한 GET 요청이 들어올 때 어떤 동작을 할지 적는 부분이다.
매개변수 req는 요청에 관한 정보가 들어있는 객체이고, res 는 응답에 관한 정보가 들어 있는 객체이다.
현재 GET/요청 시 응답으로 Hello, Express 를 전송한다. 
익스프레스에서는 res.write나 res.end 대신 res.send를 사용하면 된다.

GET 요청 외에도 POST, PUT, PATCH, DELETE, OPTIONS에 대한 라우터를 위한 app.post, app.put, app.patch, app.delete, app.options 메서드가 존재한다.
listen 을 하는 부분은 http 웹 서버와 동일하다.
4장에서 서버를 구동했던 것과 동일하게 포트를 연결하고 서버를 실행한다.
포트는 app.get('port')로 가져왔다.

*/