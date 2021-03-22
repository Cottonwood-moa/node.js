const express = require('express');

const router = express.Router();

router.get('/', (req,res)=>{
    res.send('Hello, user');0
});

module.exports= router;
