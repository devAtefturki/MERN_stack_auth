const mysql = require("mysql2")
var conn = mysql.createConnection({
    host: 'localhost',

    user: 'root',
    port:3306,

    password:'root',

    database:'auth'
})
conn.connect((err)=>{
    err?console.log(err):console.log("db connected");
})

module.exports= conn