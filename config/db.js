const mysql = require("mysql");
require('dotenv').config();

const DB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});


DB.connect(function(err){
    if (err) throw err;
    console.log('DB Connected');
});


module.exports = DB;


 