const secret_key = require("./config/secret_sms");

const axios = require('axios');
const Cache = require('memory-cache');
const CryptoJS = require('crypto-js');

const DB = require('./config/db');
const crypto = require('crypto');

const date = Date.now().toString();
const uri = secret_key.NCP_serviceID;
const secretKey = secret_key.NCP_secretKey;
const accessKey = secret_key.NCP_accessKey;
const method = 'POST';
const space = " ";
const newLine = "\n";
const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
const url2 = `/sms/v2/services/${uri}/messages`;

const  hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);

hmac.update(method);
hmac.update(space);
hmac.update(url2);
hmac.update(newLine);
hmac.update(date);
hmac.update(newLine);
hmac.update(accessKey);

const hash = hmac.finalize();
const signature = hash.toString(CryptoJS.enc.Base64);

exports.send = async function (req, res) {
    const phoneNumber = req.body.phoneNumber;
  
    Cache.del(phoneNumber);
  
    //인증번호 생성
    const verifyCode = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  
    Cache.put(phoneNumber, verifyCode.toString());
  
    axios({
      method: method,
      json: true,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'x-ncp-iam-access-key': accessKey,
        'x-ncp-apigw-timestamp': date,
        'x-ncp-apigw-signature-v2': signature,
      },
      data: {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: `${phoneNumber}`,
        content: `[AonStudio] 인증번호 [${verifyCode}]를 입력해주세요.`,
        status: 'COMPLETED',
        messages: [
          {
            to: `${phoneNumber}`,
          },
        ],
      }, 
      })
    .then(function (res) {
      res.end();
    })
    .catch((err) => {
      if(err.res == undefined){
        res.end();
      }
      else res.send(errResponse(baseResponse.SMS_SEND_FAILURE));
    });
};

exports.verify = async function (req, res) {
    const phoneNumber = req.body.phoneNumber;
    const verifyCode = req.body.verifyCode;

    const CacheData = Cache.get(phoneNumber);

    if (!CacheData) {
      return res.send('not Cache');
    } else if (CacheData !== verifyCode) {
        return res.end();
    } else {
      Cache.del(phoneNumber);
      return res.send('verify success');     
    }
};

exports.register = async(req, res) => {
    console.log('회원가입 중');

    const ID = req.body.user_id;
    const EMAIL = req.body.email;
    const PHONE_NUM = req.body.phone;
    const BIRTH = req.body.birth;
    const NAME = req.body.name;
    const PASSWORD = req.body.password;
        
    //salt 생성
    const createSalt = () =>
        new Promise((resolve, reject) => {
            crypto.randomBytes(64, (err, buf) => {
                if (err) reject(err);
                resolve(buf.toString('base64'));
            });
        });
    
    //해시값 생성   
    const createHashedPassword = (plainPassword) =>
        new Promise(async (resolve, reject) => {
            const salt = await createSalt();
            crypto.pbkdf2(plainPassword, salt, 9999, 64, 'sha512', (err, key) => {
                if (err) reject(err);
                resolve({ password: key.toString('base64'), salt});
            });
        });

    const { password, salt } = await createHashedPassword(PASSWORD);

    //회원가입 DB 연동 로직
    const param = [ID, EMAIL, PHONE_NUM, BIRTH, NAME, password, salt];
    DB.query('SELECT * FROM users WHERE user_id=?',param[0],(err, result) => {
        if(err) console.log(err);

        if(result.length> 0){
            res.send('이미 사용중인 ID입니다.');
        }else{
            const sql = 'INSERT INTO users(user_id,email,phone,birth,name,password,salt) VALUES(?,?,?,?,?,?,?);';
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
    

}
//다른 api들도 전부 모듈화, 라우터로 구성

