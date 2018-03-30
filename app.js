/**
 * Copyright 2017 Nippon Information and Communication Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// モジュールロード
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var session = require('express-session');

var app = express();

// Expressの設定
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// グローバル設定（環境変数）
global.config = {
  url : process.env.LOGIC_URL,
  secure_id : process.env.SECURE_ID
};

// 静的コンテンツ
app.use(express.static(__dirname + '/public'));

// セッション設定
app.use(session({
  secret: global.config.secure_id,
  resave: false,
  saveUninitialized: false,
  rolling : true,
  cookie: {
    maxAge: 30 * 60 * 1000
  }
}));

// HTTPの場合にHTTPSにリダイレクト
// （x-forwarded-protoヘッダが存在する環境のみ）
app.use(function (req, res, next) {
  if(req.headers["x-forwarded-proto"]){
    if(req.headers["x-forwarded-proto"] == "http"){
      res.redirect('https://' + req.headers.host + req.url);
    } else {
      next();
    }
  }else{
    next();
  }
});

/* セッション不要 */
// ログイン処理
app.post("/login", function(req, res) {
  var options = {
    url : global.config.url + "v1/auth",
    method : "POST",
    headers : {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : ""
    },
    json : req.body
  };
  request(options, function(err, response, body){
    if (err || response.statusCode !== 200) {
      res.render('error', {"message" : "認証時にエラーが発生しました。"});
    } else {
      if(body.result){
        // セッション設定
        req.session.user_id = body.user_id;
        req.session.session_id = body.session_id;
        res.redirect("/");
      }else{
        res.render('index', body);
      }
    }
  });
});

// セッションチェック
// （以降、要セッション）
app.use(function (req, res, next) {
  if(req.session.session_id){
    console.log("[" + req.session.session_id + "] Url:" + req.url);
    console.log("[" + req.session.session_id + "] Body:" + JSON.stringify(req.body));
    next();
  }else{
    res.render("index", {errorMessage : null});
  }
});

// main処理
app.get("/", function(req, res) {
  if(req.session.session_id){
    res.render('menu');
  }else{
    res.render('index',{ errorMessage : null });
  }
});
app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/");
});

// 各処理の読み込み
app.use("/discovery/", require("./routes/discovery.js"));
app.use("/doc/", require("./routes/doc.js"));
app.use("/feedback/", require("./routes/feedback.js"));
app.use("/training/", require("./routes/training.js"));
app.use("/log/", require("./routes/log.js"));
app.use("/user/", require("./routes/user.js"));

// アプリケーション起動処理
var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port %d', server.address().port);
});
