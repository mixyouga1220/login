const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
const mysql = require('mysql')
const { S3, ListObjectsCommand } = require('@aws-sdk/client-s3');
const { render } = require('ejs');
const DynamoDBStore = require('connect-dynamodb')({session: session})

app.get('/', (req, res) => {
  res.render('hoge.ejs',{name:"hello"})
})

app.listen(8080);
