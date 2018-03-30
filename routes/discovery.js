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
 * Discovery
 */
"use strict";

var express = require('express');
var request = require('request');
var router = express.Router();

// APIパス
var ApiPath = "v1/discovery";

/* コレクション一覧 */
router.get('/list', function(req, res) {
  var options = {
    url : global.config.url + ApiPath,
    method : "GET",
    headers : {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json : true
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.render('discovery/list', { data : body});
    } else if (!error && response.statusCode < 500) {
      body.href = req.headers.referer;
      res.render("warning", body);
    } else {
      res.render("error", { message : null });
    }
  });
});

/* コレクション追加 */
router.post('/add', function(req, res) {

  var options = {
    url : global.config.url + ApiPath,
    method : "POST",
    headers : {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json : req.body
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body.href = req.headers.referer;
      res.render('success', body);
    } else if (!error && response.statusCode < 500) {
      body.href = req.headers.referer;
      res.render("warning", body);
    } else {
      res.render("error", body);
    }
  });
});

/* コレクション切り替え */
router.post('/change', function(req, res) {

  var options = {
    url : global.config.url + ApiPath + "/change",
    method : "POST",
    headers : {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json : req.body
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body.href = req.headers.referer;
      res.render('success', body);
    } else if (!error && response.statusCode < 500) {
      body.href = req.headers.referer;
      res.render("warning", body);
    } else {
      res.render("error", body);
    }
  });
});

/* コレクション削除 */
router.post('/delete', function(req, res) {

  var options = {
    url : global.config.url + ApiPath + "/" + req.body.id,
    method : "DELETE",
    headers : {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json : true
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body.href = req.headers.referer;
      res.render('success', body);
    }else{
      res.render("error", body);
    }
  });
});

/* 学習処理 */
router.post('/training', function(req, res) {

  var options = {
    url : global.config.url + ApiPath + "/training",
    method : "POST",
    headers : {
      "X-SECURE-ID" : global.config.secure_id,
      "X-SESSION-ID" : req.session.session_id
    },
    json : req.body
  };

  request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body.href = req.headers.referer;
      res.render('success', body);
    } else if (!error && response.statusCode < 500) {
      body.href = req.headers.referer;
      res.render("warning", body);
    } else {
      res.render("error", body);
    }
  });
});


module.exports = router;
