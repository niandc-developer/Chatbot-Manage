# Chatbot Manage

Watson Assistant と Discovery を用いたシンプルなチャットボットFAQ用の管理用アプリケーションサンプル  
（チャットUI用のアプリケーションサンプルはこちら。https://github.com/niandc-developer/Chatbot-Front ）


## 環境構築手順

***IBM Cloud上での稼働を前提としております***  

### 必要ランタイムとサービス
* Node-RED ボイラープレート
* Node.js ランタイム
* Db2 Warehouse
* Watson Assistant
* Watson Discovery

### DBの準備
1. Db2の管理コンソールにログイン
2. logic/ddl ディレクトリにあるDDLをDb2に流す

### ロジック環境の準備
1. Db2 Warehouse, Watson Assistant, Watson Discoveryをランタイムに接続する
2. Node-RED のフローエディタにログイン
3. logic/flow にあるフロー定義をインポート（クリップボードから読み込み）
4. Common フローの 接続情報設定ノード の中身を、環境に合わせて修正する
  1. secure_id ： UIアプリ（このGitのアプリ）とロジックアプリ（このGit内にあるNode-REDのフロー）との間を通信する際のID
  2. discovery ： Discoveryの接続情報

### UI環境の準備
1. このGitにあるソースコードを、Node.jsランタイムにcf push
2. ランタイムの環境変数に以下を設定
  1. LOGIC_URL ： ロジックアプリのURL（ex. https://example.mybluemix.net/ ）
  2. SECURE_ID ： ロジックアプリと通信する際のID（ロジックアプリの接続情報設定に設定した値）


## Copyright
Copyright 2018 Nippon Information and Communication Corporation

## License
This sample code is licensed under Apache 2.0.
Full license text is available in [LICENSE](LICENSE).
