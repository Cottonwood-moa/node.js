const http = require('http');

http.createServer((req, res)=>{
    res.writeHead(200, {'Content-Type':'text/html; charset=utf-8'});
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})

.listen(8080, ()=>{
console.log('8080번 포트에서 서버 대기 중입니다!');
});

/* 
localhost포트란?
localhost는 현재 컴퓨터의 내부 주소를 가리킨다. 
외부에서는 접근할 수 없고 자신의 컴퓨터에서만 접근할 수 있으므로, 서버 개발 시 테스트용으로 많이 사용된다. 
localhost 대신 127.0.0.1을 주소로 사용해도 같다.
이러한 숫자 주소를 IP(Internet Protocol)라고 부른다.
서버를 종료하려면 콜솔에서 ctrl + c를 누르자.
ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ
성공적으로 첫 서버를 실행했으니 다시 코드의 내용을 살펴보자.
createServer 메서드 뒤에 listen 메서드를 붙이고 클라이언트에 공개할 포트 번호와 포트 연결완료 후 실행될 콜백 함수를 넣는다.
이제 이 파일을 실행하면 서버는 8080 포트에서 요청이 오기를 기다린다.

res객체에는 res.writeHead와 res.write, res.end 메서드가 있다.
res.writeHead는 응답에 대한 정보를 기록하는 메서드이다.
첫 번째 인수로 성공적인 요청임을 의미하는 200을, 두 번째 인수로 응답에 대한 정보를 보내는데 콘테츠의 형식이 HTML임을 알리고 있다.
또한 한글 표시를 위해 charset을 utf-8로 지정한다. 이 정보가 기록되는 부분을 헤더(Header)라고 부른다.

res.write 메서드의 첫 번째 인수는 클라이언트로 보낼 데이터이다.
지금은HTML 모양의 문자열을 보냈지만 버퍼를 보낼 수도 있다.
또한, 여러 번 호출해서 데이터를 여러 개 보내도 된다. 
데이터가 기록되는 부분을 본문(Body)이라고 부른다. 
헤더와 본문은 다음 절에서 자세히 알아보자.

*/