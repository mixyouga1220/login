const crypto = require('crypto');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true })); 
const mysql = require('mysql')

//初期ページ読み込み
app.get('/', (req, res) => {
  res.render('hoge.ejs',{name:" "});
});

//ID pass読み取り
app.post("/top", (req,res)=>{
  id =req.body.mozi1;
  pass =  req.body.mozi2;
  const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'mydb'
  });
  connection.connect((err) =>{
    if(err)throw err
  })
  connection.query('SELECT * FROM users', (err, results) =>{
    if (err){
      throw err
    }
    if (results){
      console.log(results);
    }
    var angou = crypto.createHash('sha256').update(pass).digest('hex')
    for (let i=0; i<results.length; ++i){
      if(id==results[i].user_id){   
         //ログイン処理 ユーザ1は123　ユーザー２はabc
        if(id==results[i].user_id && angou==results[i].password){
          res.render('hoge.ejs',{name: "hi! " + results[i].name});
       }else{
            res.render('hoge.ejs',{name: "id又はパスワードが間違っています"});
       }
      }
    }
  })
  connection.end()
});
      
app.listen(8080);
