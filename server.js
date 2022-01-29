"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const DB = require('./db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const PORT = 8080;

app.listen(PORT, () => {
    console.log("Todo-Server is running");
});
 


//post API

//회원가입 (DB연동 후 API를 통해 유저 정보 DB로 전송)
app.post('/register', (req, res) => {
    const param = [req.body.birth, req.body.name, req.body.password];

    DB.query('INSERT INTO users(birth,name,password) VALUES(?,?,?);', param, (err, result) => {

        console.log(param);

    });
    res.end();
});


// //로그인
// app.post('/login')


// //로그인 이후 모든 todo-list 가져오기
// app.get('/todo/all')
