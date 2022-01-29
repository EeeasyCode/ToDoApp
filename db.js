const mysql = require("mysql");

const DB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'todo_db',
    port:3306
});

DB.connect(function(err){
    if (err) throw err;
    console.log('Connected');
});


module.exports = DB;


 