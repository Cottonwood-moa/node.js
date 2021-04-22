# 다른 서비스에서 호출하기
API 제공 서버를 만들었으니 API를 사용하는 서비스도 만들어보자.
이 서비스는 다른 서버에게 요청을 보내므로 클라이언트 역할을 한다.
API 제공자가 아닌 API 사용자의 입장에서 진행하는 것이며, 바로 NodeBird 앱의 데이터를 가져오고 싶어 하는 사용자이다.
보통 그 데이터를 가공해 2차적인 서비스를 하려는 회사가 API 를 많이 사용한다.
예를 들어 쇼핑몰등이 있으면, 쇼핑몰들의 최저가를 알려주는 서비스가 2차 서비스가 된다.
우리의 2차 서비스 이름은 NodeCat 이다.
nodebird-api 폴더와 같은 위치에 nodecat 이라는 새로운 폴더를 만든다.
별도의 서버이므로 nodebird-api와 코드가 섞이지 않게 주의하자.

    nodecat/pakcage.json

    npm i axios cookie-parser dotenv express express-session morgan nunjucks
    npm i -D nodemon

이 서버의 주목적은 nodebird-api의 API를 통해 데이터를 가져오는 것이다.
가져온 데이터는 JSON 형태이므로 퍼그나 넌적스 같은 템플릿 엔진으로 데이터를 렌더링할 수도 있다.
서버 파일과 에러를 표시할 파일을 생성한다.

    nodecat/app.js

사용하지 않는 미들웨어는 걷어내고 최소한으로 app.ks 를 구성했다.

    view/error.html

API를 사용하려면 먼저 사용자 인증을 받아야 하므로 사용자 인증이 원활하게 징행되는지 테스트하는 라우터를 만들어보자.
조금 전에 발급받은 clientSecret을 .env에 넣는다.

    nodecat/.env
    nodecat/routes/index.js

GET /test 라우터는 NodeCat 서비스가 토큰 인증 과정을 테스트해보는 라우터이다.
이 라우터의 동작 과정은 다음과 같다.
요청이 왔을 때 세션에 발급받은 토큰이 저장되어 있지 않다면 http://localhost/8002/v1/token 라우터로부터 토큰을 받는다.
이떄 HTTP 요청의 본문에 클라이언트 비밀 키를 실어 보낸다.
발급에 성공했다면 (응답 데이터의code 속성이 200이면 성공한 것이라고 약속함), 발급받은 토큰으로 다시 GET http://localhost/8002/v1/token에 접근하여 토큰이 유요한지 테스트해본다. 이때는 JWT 토큰을 요청 본문 대신 authorization 헤더에 넣었다.
보통 인증용 토큰은 이 헤더에 주로 넣어 전송한다.

실제로 GET /test 라우터를 사용해보자.
콘솔을 하나 더 띄어 서버(4000)를 실행한다.
nodebird-api (8002)도 실행 중이어야 한다.

http://localhost:4000/test로 접속하면 된다.
요청을 받는 http://localhost:8002 와 다른 주소임을 기억하자.
localhost:8002는 API 를 제공하는 nodebird-api 서버고, localhost:4000 은 API 서비스를 사용하는 NodeCat 서버이다.
접속하면 다음과 같이 발급받은 토큰의 내용이 표시된다.

    {"id":2,"nick":"Cottonwood","iat":1619086936,"exp":1619086996,"iss":"nodebird"}

잘 동작하는 것 같지만 아직 코드에 부족한 부분이 있다.
1분을 기다린 후 http://localhost:4000/test 라우터에 다시 접속하면, 토큰이 만료되었다는 메시지가 뜬다.

    {"code":419,"message":"토큰이 만료되었습니다"}

토큰의 유효 기간이 1분이었으므로 1분 후에는 발급받은 토큰을 갱신해야 한다.
API 서버에서 에러 코드와 에러 메시지를 상세하게 보내줄수록 클라이언트가 무슨 일이 있어났는지 이해하기 쉽다.
토큰이 만료되었을 때 갱신하는 코드를 추가해야 한다는 것을 잊지 말자.
이 부분은 다음 절에서 작성한다.

