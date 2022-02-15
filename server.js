"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const DB = require('./config/db');
// const crypto = require('crypto');
const user = require('./usercontroller');

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));




app.listen(process.env.PORT || 8080, () => {
    console.log("Todo-Server is running");
});
 

//GET API
// app.get('/login')




app.get('/register', (req, res) => {
    console.log('회원가입 페이지');
    res.render('register');
});


//회원가입 API(DB연동 후 API를 통해 유저 정보 DB로 전송)
//crypto를 통해 password를 hash처리하여 DB로 전송

app.post('/register', user.register);

//회원가입 시 문자인증(SENS를 통한) 전송 API
app.post('/sms/send', user.send);

//회원가입 시 문자인증(SENS를 통한) 검증 API
app.get('/sms/verify', user.verify);



//oauth
// 로그인 API
// app.post('/login', () => {
//    const ID = req.body.id; 
//    const PASSWORD = req.body.password;
   
//    const sql = '';
   
// });


// //로그인 이후 모든 todo-list 가져오기
// app.get('/todo/all')
