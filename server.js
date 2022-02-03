"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const DB = require('./db');
const crypto = require('crypto');
const { rejects } = require('assert');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


const PORT = 8080;

app.listen(PORT, () => {
    console.log("Todo-Server is running");
});
 

//GET API
// app.get('/login')




app.get('/register', (req, res) => {
    console.log('회원가입 페이지');
    res.render('register');
});


//회원가입 API(DB연동 후 API를 통해 유저 정보 DB로 전송)
//bcrpt를 통해 password를 hash처리하여 DB로 전송

app.post('/register', async(req, res) => {
    console.log('회원가입 중');

    const ID = req.body.user_id;
    const EMAIL = req.body.email;
    const PHONE_NUM = req.body.phone;
    const BIRTH = req.body.birth;
    const NAME = req.body.name;
    const PASSWORD = req.body.password;
        

    const createSalt = () =>
        new Promise((resolve, reject) => {
            crypto.randomBytes(64, (err, buf) => {
                if (err) reject(err);
                resolve(buf.toString('base64'));
            });
        });

    const createHashedPassword = (plainPassword) =>
        new Promise(async (resolve, reject) => {
            const salt = await createSalt();
            crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
                if (err) reject(err);
                resolve({ password: key.toString('base64'), salt});
            });
        });

    const { password, salt } = await createHashedPassword(PASSWORD);

    const sql = 'INSERT INTO users(user_id,email,phone,birth,name,password,salt) VALUES(?,?,?,?,?,?,?);';
    const param = [ID, EMAIL, PHONE_NUM, BIRTH, NAME, password, salt];
    DB.query('SELECT * FROM users WHERE user_id=?',param[0],(err, result) => {
        if(err) console.log(err);

        if(result.length> 0){
            res.send('이미 사용중인 ID입니다.');
        }else{
            DB.query(sql, param, (err, result) => {
                if (err){
                    console.log(err);
                    res.status(500).send('ERROR');
                }else{
                console.log('success sign-up!');
                }
                res.end();
            });
        };

    });
    

});




// 로그인 API
app.post('/login', () => {
   const ID = req.body.id; 
   const PASSWORD = req.body.password;
   
   const sql = '';
   
});


// //로그인 이후 모든 todo-list 가져오기
// app.get('/todo/all')
