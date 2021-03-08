/* 
쿠키는 요청의 헤더에 담겨 전송된다.
브라우저는 응답의 헤더에 따라 쿠키를 저장한다.
*/

const http = require('http');

http.createServer((req, res) => {
    console.log(req.url, req.headers.cookie);
    res.writeHead(200, { 'Set-Cookie': 'mycookie=test' });
    res.end('Hello Cookie');
})
    .listen(8083, ()=>{
        console.log('8083번 포트에서 서버 대기 중입니다!');
    });

    /* 
    쿠키는 name = cottonwood ; year = 1995처럼 문자열 형식으로 존재한다.
    쿠키 간에는 세미콜론으로 구분된다.
    createServer 메서드의 콜백에서는 req 객체에 담겨 있는 쿠키를 가져온다.
    쿠키는 req.headers.cookie에 들어 있다.
    req.headers는 요청의 헤더를 의미한다.
    쿠키는 요청과 응답의 헤더를 통해 오간다고 했다.

    응답의 헤더에 쿠키를 기록해야 하므로 reswriteHead 메서드를 사용했다.
    Set-Cookie는 브라우저한테 다음과 같은 값의 쿠키를 저장하라는 의미이다.
    실제로 응답을 받은 브라우저는 mycookie=test 라는 쿠키를 저장한다.
    localhost:8083에 접속한다.
    req.url과req.headers.cookie에 대한 정보를 로깅하도록 했다.
    req.url 은 주소의 path와 search 부분을 알린다.
    */