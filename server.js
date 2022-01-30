"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const DB = require('./db');
const bcrypt = require('bcrypt-nodejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const PORT = 8080;

app.listen(PORT, () => {
    console.log("Todo-Server is running");
});
 


//post API


//회원가입 (DB연동 후 API를 통해 유저 정보 DB로 전송)
//bcrpt를 통해 password를 hash처리하여 DB로 전송

app.post('/register', async(req, res) => {

    const BIRTH = req.body.birth;
    const NAME = req.body.name;
    const PASSWORD = req.body.password;
    
    await bcrypt.hash (PASSWORD, null, null, (err, hash) => {
        const sql = 'INSERT INTO users(birth,name,password) VALUES(?,?,?);';
        const param = [BIRTH, NAME, hash];
        DB.query(sql, param, (err, result) => {
            if (err){
                console.log(err);
                res.status(500).send('ERROR');
            }else{
            console.log('success sign-up!');
            console.log('hash');
            }
            res.end();
        })

    });


});


// //로그인
// app.post('/login')


// //로그인 이후 모든 todo-list 가져오기
// app.get('/todo/all')
