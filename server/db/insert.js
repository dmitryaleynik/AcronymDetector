'use strict'

let mySql = require('mysql');

let connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'articles'
});
connection.connect( error => {
    if(error) throw error;
    console.log('Connected');
});