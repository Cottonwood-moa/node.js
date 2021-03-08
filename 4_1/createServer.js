/* 서버는 클라이런트가 있기에 동작한다. 클라이언트에서 서버로 요청을 보내고, 서버에서는 요청의 내용을 읽고 처리한 뒤 클라이언트에 응답을 보낸다.
 따라서 서버에는 요청을 받는 부분과 응답을 보내는 부분이 있어야 한다. 요청과 응답은 이벤트 방식이라고 생각하면 된다. 클라이언트로부터 요청이 왔을 때 어쩐 작업을 수행할지 이벤트 리스너를 미리
 등록해두어여 한다. 이벤트 리스너를 가진 노드 서버를 만들어보자.
*/
const http = require('http');

http.createServer((req, res)=>{
    //여기에 어떻게 응답할지 적는다.
});

/* http서버가 있어야 웹 브라우저의 요청을 처리할 수 있으므로 http 모듈을 사용했다. http 모듈에는 createServer 메서드가 있다. 인수로 요청에 대한 콜백 함수를 넣을 수 있으며, 요청이 들어올 때마다 매번 콜백 함수가 실행된다.
따라서 이 콜백 함수에 응답을 적으면 된다.
createServer의 콜백 부분을 보면 req와 res 매개변수가 있다. 보통 request를 줄여 req라고 표현하고, response를 줄여 res 라고 표현한다.(매개변수의 이름을 마음대로 바꾸는 것은 물론 가능하다)
req객체는 요청에 관한 정보들을, res 객체는 응답에 관한 정보들을 담고 있다.
아직은 코드를 실행해도 아무 일도 일어나지 않는다. 요청에 대한 응답도 넣어주지 않았고 서버와 연결하지도 않았기 때문이다.
다음 예제에서 응답을 보내는 부분과 서버에 연결하는 부분을 추가해보자.
*/