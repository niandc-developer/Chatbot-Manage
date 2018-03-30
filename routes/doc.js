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

/*
 * Collectionデータメンテナンス
 */
"use strict";

var express = require('express');
var request = require('request');
var router = express.Router();

// APIパス
var ApiPath = "v1/doc";

/* 一覧画面 */
router.get('/list', function(req, res) {

  var now = 1;
  if(req.query.p){
    if(!isNaN(req.query.p)){
        now = parseInt(req.query.p);
    }
  }

  var options = {
    url: global.config.url + ApiPath + "?p=" + now,
    method: 'GET',
    headers: {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      // 全件数
      var count = body.count;

      var pageNum = Math.floor(5/2);

      // ページ計算
      var page = {
          first : now - pageNum,
          last : now + pageNum,
          now : now,
          max : Math.ceil(count/10)
      }
      if(page.first > (page.max - pageNum*2)){
        page.first = page.max - pageNum*2;
      }
      if(page.first < 1){
        page.first = 1;
      }
      if(page.last < pageNum*2+1){
        page.last = pageNum*2+1;
      }
      if(page.last > page.max){
          page.last = page.max;
      }

      // ページの描画
      res.render('doc/list', {
        body : body.result,
        page : page
      });

    } else if (!error && response.statusCode < 500) {
      body.href = req.headers.referer;
      res.render("warning", body);
    } else {
      res.render('error', {message : null});
    }
  });
});

/* 追加画面 */
router.get('/edit', function(req, res) {
  res.render("doc/edit",{ data : {} });
});

/* 編集画面 */
router.get('/edit/:id', function(req, res) {

  var url = global.config.url + ApiPath + "/" + req.params.id;
  var options = {
    url: url,
    method: 'GET',
    headers: {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json: true
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render("doc/edit", { data : body[0] });
    } else if (!error && response.statusCode < 500) {
      body.href = req.headers.referer;
      res.render("warning", body);
    } else {
      res.render('error', {message : null});
    }
  });
});

/* データ更新 */
router.post('/edit', function(req, res) {
  var url = global.config.url + ApiPath;

  var method = "";
  if(req.body.data_id){
    method = "PUT";
  }else{
    method = "POST";
  }

  var options = {
    url: url,
    method: method,
    headers: {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json: req.body
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body.href = "/doc/list";
      res.render("success", body);
    } else if (!error && response.statusCode < 500) {
      body.href = req.headers.referer;
      res.render("warning", body);
    } else {
      res.render("error", body);
    }
  });
});

/* データ削除 */
router.post('/delete', function(req, res) {

  var url = global.config.url + ApiPath + "/" + req.body.id;

  var options = {
    url: url,
    method: "DELETE",
    headers: {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json: true
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body.href = req.headers.referer;
      res.render("success", body);
    } else if (!error && response.statusCode < 500) {
      body.href = req.headers.referer;
      res.render("warning", body);
    } else {
      res.render("error", body);
    }
  });
});

// データ取得（API）
router.get('/data/:id', function(req, res) {
  var url = global.config.url + "v1/doc/" + req.params.id;
  var options = {
    url: url,
    method: 'GET',
    headers: {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json: true
  };
  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    }
  });
});

module.exports = router;
