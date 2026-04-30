const mysql =require("mysql");

const db=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456789',
    database:'dbs'
});

module.exports=db;