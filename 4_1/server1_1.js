/* listen 메서드에 콜백 함수를 넣는 대신, 다름과 같이 서버에 listening 이벤트 리스너를 붙여도 된다. 추가로 error 이벤트 리스너도 붙여봤다. */
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
});
server.listen(8080);

server.on('listening', () => {
    console.log('8080번 포트에서 서버 대기 중입니다!');
});
server.on('error', (error) => {
    console.error(error);
});

/* 소스 코드 변경
서버의 소스 코드를 변경할 때 서버가 자동으로 변경 사항을 반영하지는 않는다.
서버를 종료했다가 다시 실행해야 변경 사항이 반영된다.
*/