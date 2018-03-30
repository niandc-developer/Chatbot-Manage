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
 * 学習データメンテナンス
 */
"use strict";

var express = require('express');
var request = require('request');
var router = express.Router();

// APIパス
var ApiPath = "v1/training";
var ApiDataPath = "v1/training/data";

/* 追加画面 */
router.get("/add", function(req, res) {
  res.render("training/add");
});

/* 一覧画面 */
router.get('/list', function(req, res) {

  var now = 1;
  if(req.query.p){
    if(!isNaN(req.query.p)){
        now = parseInt(req.query.p);
    }
  }
  if(now < 1){
    now = 1;
  }

  var options = {
    url : global.config.url + ApiPath + "?p=" + now,
    method : "GET",
    headers : {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json : true
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
      if(page.last < 1){
        page.last = 1;
      }

      // 件数チェック
      if(body.result.length > 0){
        res.render('training/list', {
          data: body.result,
          page: page
        });
      }else if(page.now > 1){
        var page = page.now-1;
        res.redirect('/training/list?p='+page);
      }else{
        console.log(page);
        res.render('training/list', {
          data: [],
          page: page
        });
      }
    } else if (!error && response.statusCode < 500) {
      res.render("warning", body);
    } else{
      res.render("error", body);
    }
  });
});

/* データ登録処理 */
router.post("/add", function(req,res) {

  var options = {
    url : global.config.url + ApiPath,
    method : "POST",
    headers : {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json : req.body
  }
  request(options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      body.href = req.headers.referer;
      res.render("success", body);
    } else if (!error && response.statusCode < 500) {
      res.render("warning", body);
    } else {
      res.render("error", body);
    }
  });

});

/* データ更新・削除処理 */
router.post("/update", function(req,res) {

  var method = "";

  if(req.body.mode == "regist"){
    method = "POST";
  }else if(req.body.mode == "update"){
    method = "PUT";
  }else if(req.body.mode == "delete"){
    method = "DELETE";
  }else{
    res.render("error", { message : null });
  }

  var options = {
    url : global.config.url + ApiDataPath,
    method : method,
    headers : {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json : req.body
  }

  request(options, function(error, response, body) {
    body.href = req.headers.referer;
    if (!error && response.statusCode == 200) {
      res.render("success", body);
    } else if (!error && response.statusCode < 500) {
      res.render("warning", body);
    } else {
      res.render("error", body);
    }
  });

});

module.exports = router;
