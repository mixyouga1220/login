const express = require('express');
const crypto = require('crypto');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');
const { render } = require('ejs');
const path = require('path');
const fs = require('fs');
const { rootCertificates } = require('tls');
const MySQLStore = require('express-mysql-session')(session);
const app = express();
app.use(express.static('./public'));
app.set('view engine' , 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false
}));

app.get('/',(req,res) =>{
  if (req.session.name) {
    const cone = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '123',
      database: 'sotukendb',
    });
    cone.connect((err) =>{if(err)throw err});
    cone.query('select * from dbuser' , (err, result) =>{if (err){throw err}if(result){}
      for(let ii=0; ii<result.length; ii++){
        if(req.session.name == result[ii].ID && req.session.PASS == result[ii].PASS){
          if(result[ii].BUMON == "1"){
            res.render('after.ejs',{
              bumon:"A部門ページです",
              name:"こんにちは！" + result[ii].NAME + "さん"
            });
          }
          else if (result[ii].BUMON == "2"){
            res.render('after.ejs',{
              bumon:"B部門ページです",
              name:"こんにちは！" + result[ii].NAME + "さん"
            });
          }
        }
      }
    });
    cone.end()
  }
  else if (!req.session.name) {
    res.render('page.ejs',{log:" "});
  }
});

app.post('/top' , (req,res) =>{
  var name = req.body.mozi1;
  var pass = req.body.mozi2;
  const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'sotukendb',
  });
  con.connect((err) =>{if(err)throw err});
  con.query('select * from dbuser' , (err, results) =>{if (err){throw err}if(results){}
  console.log(results);
    for (let i=0; i<results.length; ++i){
      if(name == results[i].ID && pass == results[i].PASS){
        req.session.name = results[i].ID;
        req.session.PASS = results[i].PASS;
        console.log("Ok");
        if(results[i].BUMON == "1"){
          res.render('after.ejs',{
            bumon:"A部門ページです",
            name:"こんにちは！" + results[i].NAME + "さん"
          });
        }
        else if (results[i].BUMON == "2"){
          res.render('after.ejs',{
            bumon:"B部門ページです",
            name:"こんにちは！" + results[i].NAME + "さん"
          });
        }
      }
    }
    res.render('page.ejs',{log:"ID又はパスワードが間違っています。"});
    con.end();
    console.log("connection end")
  });
  });
app.listen(8080);