const express = require('express');

const router = express.Router();

router.get('/', (req,res)=>{
    res.send('Hello, Express');
});

module.exports=router;

/* 
만들었던 index.js 와 user.js 를 통해 app.js 에 연결한다.
또한, 에러 처리 미들웨어 위에 404 상태 코드를 응갑하는 미들웨어를 하나 추가한다.

*/