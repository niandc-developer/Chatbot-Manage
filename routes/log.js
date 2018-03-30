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
 * アプリログ管理
 */
"use strict";

var express = require('express');
var request = require('request');
var router = express.Router();

// APIパス
var ApiPath = "v1/log";
// 1ページの表示数
var num = 30;

/* ログ一覧表示 */
router.get('/list', function(req, res) {

  // 現在ページ
  var now = 1;
  if(req.query.p){
    if(!isNaN(req.query.p)){
        now = parseInt(req.query.p);
    }
  }

  var options = {
    url: global.config.url + ApiPath + "?p=" + now + "&l=" + num,
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
          max : Math.ceil(count/num)
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
      res.render('log/list', {
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

module.exports = router;
