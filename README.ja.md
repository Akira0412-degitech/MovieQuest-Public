# 🎬 MovieQuest

**MovieQuest** は、映画情報の検索・閲覧・ユーザ管理機能を備えたフルスタック Web アプリケーションです。
フロントエンドには **React (Vite)**、バックエンドには **Express + MySQL** を使用し、**JWTベースのHTTP-only Cookie認証** を採用しています。

---

## 🔧 使用技術

### 💥 フロントエンド

* **React + Vite**: 高速フロントエンド構築
* **Chart.js + ag-Grid**: グラフと表のデータ可視化
* **Axios**: HTTP通信。カスタムインスタンスと認証付き通信を実装, Cookie付きHTTP通信（`withCredentials: true`）
* **react-router-dom**: ページルーティングとナビゲーション管理
* **react context**: 認証状態のグローバル管理


### 🛠️ バックエンド

* **Node.js + Express**: REST API サーバー、ルーティング機能の分離と拡張が容易な構成
* **MySQL (mysql2)**: 高速なリレーショナルデータベース接続
* **Knex.js**: クエリビルダー / SQLインジェクション対策 / 簡潔なDB操作
* **JWT + Cookie（httpOnly）**: セキュアなアクセストークン + リフレッシュトークン管理
* **Cookie Parser + CORS**: 認証付き通信のためのCookie送信とオリジン制御を明示設定
* **HTTPS**: OpenSSLによる自己署名証明書を使ったローカル環境の安全性確保
* **dotenv**: `.env` ファイルによる環境設定の切り替え
* **Swagger (OpenAPI)**: 自動生成されたGUIドキュメントによりAPI設計が一目で分かる
* **bcrypt**: パスワードの安全なハッシュ化と認証処理
* **jsonwebtoken**: Bearer・Refreshトークンを使い分けた精緻な認可処理
* **morgan**: HTTPログ出力による開発・デバッグ支援

---

## 📁 ディレクトリ構成

```
MovieQuest/
├── my-movie-app/                # フロントエンド
├── ServerSide_Application/      # バックエンド
├── .env                         # 環境変数（非公開）
```

### 🔙 バックエンド

```
ServerSide_Application/
├── app.js              # Express 設定
├── server.js           # HTTPS 起動スクリプト
├── knexfile.js         # DB設定
├── routes/             # API ルーティング
├── middleware/         # 認証ミドルウェア
├── docs/openapi.json   # Swagger 定義
├── public/             # 静的ファイル
├── views/              # エラーページ
```

### 🔠 フロントエンド

```
my-movie-app/src/components/
├── api.jsx
├── AuthContext.jsx
├── Home.jsx
├── Login.jsx
├── MovieDetail.jsx
├── Movies.jsx
├── PersonDetail.jsx
├── Profile.jsx
├── Register.jsx
├── setInterceptors.jsx
```

---

## 🚀 ローカル開発手順

### 1️⃣ リポジトリのクローン

プロジェクトをGitHubからローカルにクローンします：

```bash
# リポジトリをクローン
git clone https://github.com/your-username/MovieQuest.git
cd MovieQuest
```

### 2️⃣ 環境変数ファイル `.env` の準備

プロジェクトには `.env` ファイルが必要ですが、**セキュリティ上の理由から `.env` はリポジトリに含めていません**。
代わりに `.env.example` を提供しているため、これをコピーして作成してください：

```bash
# サンプルファイルから .env ファイルを作成
cp ServerSide_Application/.env.example ServerSide_Application/.env
```

その後、以下のように `.env` を編集してください：

```env
DB_USER=your_mysql_user           # あなたのMySQLユーザー名（例：root）
DB_PASSWORD=your_mysql_password   # あなたのMySQLパスワード
JWT_SECRET=your_jwt_secret        # 任意のランダムな長い文字列を設定してください
SSL_KEY_PATH=./ServerSide_Application/localhost-key.pem  # キーファイルのパス
SSL_CERT_PATH=./ServerSide_Application/localhost.pem     # 証明書ファイルのパス
```

> 🔐 `.env` には **機密情報が含まれるため絶対にGitHub等にアップロードしないでください**。
> `.env.example` は、他の開発者が `.env` を作成する際の参考になります。
> また、`localhost.pem` や `localhost-key.pem` の生成場所が `ServerSide_Application/` ディレクトリであることに注意してください。bash

# サンプルファイルから.envファイルをコピー

```bash
cp ServerSide\_Application/.env.example ServerSide\_Application/.env

````

以下のように `.env` ファイルを編集してください：

```env
DB_USER=your_mysql_user          # MySQLユーザー名（例：root）
DB_PASSWORD=your_mysql_password  # MySQLパスワード
JWT_SECRET=your_secure_jwt_secret  # JWTの秘密鍵
SSL_KEY_PATH=./localhost-key.pem   # HTTPS秘密鍵のパス
SSL_CERT_PATH=./localhost.pem      # HTTPS証明書のパス
````

### 3️⃣ HTTPS証明書の生成 (OpenSSLが必要)

ローカルでHTTPSを使うため、自己署名証明書を生成します：

```bash
# HTTPS用の秘密鍵と証明書の生成
openssl req -nodes -new -x509 -keyout localhost-key.pem -out localhost.pem
```

> 📝 `localhost-key.pem` と `localhost.pem` はプロジェクトのルートまたは `ServerSide_Application/` に配置してください。

### 4️⃣ MySQL データベースの準備

MySQLに接続し、データベースとテーブルを作成します：

```bash
# MySQLにログイン
mysql -u root -p
```

```sql
-- データベースを作成し、SQLダンプを読み込む
CREATE DATABASE moviequest;
USE moviequest;
SOURCE path/to/dump.sql;
```

### 5️⃣ 依存パッケージのインストール

プロジェクトルートで以下を実行して、すべての依存関係を一括でインストールします：

```bash
npm install
```

> `concurrently` を使って `my-movie-app` と `ServerSide_Application` の依存関係が同時にセットアップされます。

必要に応じて、個別にインストールすることも可能です：

```bash
# フロントエンドのみインストール
cd my-movie-app
npm install

# バックエンドのみインストール
cd ../ServerSide_Application
npm install
```

### 6️⃣ アプリケーション起動

プロジェクトルートで以下を実行して、フロントエンドとバックエンドを同時に起動します：

```bash
npm run dev
```

アクセスURL：

* 🌐 フロントエンド: [http://localhost:5173](http://localhost:5173)
* 🔐 バックエンド: [https://localhost:3000](https://localhost:3000)

---

## 📘 API ドキュメント (Swagger UI)

アプリケーション起動後、以下のURLからAPI仕様を確認できます：

* [https://localhost:3000/docs](https://localhost:3000/docs)

---

## 🔐 認証フロー

MovieQuestはJWTとCookieを用いたセキュアな認証方式を採用しています：

1. ユーザーが `/login` にPOSTリクエストを送信
2. サーバーがJWTを生成し `httpOnly Cookie` に保存
3. Axios（フロントエンド）が自動的にCookieを付与して通信（`withCredentials: true`）
4. トークン期限切れ時、インターセプターにより自動更新（リフレッシュ）

---

## 📄 ライセンス

MIT License © 2025 \Akira Hasuo


---
## 🌟 技術的こだわり・アピールポイント
このプロジェクトは、学生課題にとどまらず、実用性・セキュリティ・拡張性 を意識して設計・実装されています。以下は特に注力したポイントです。

## ✅ セキュアな認証システム（JWT + HTTP-only Cookie）
アクセストークンは HTTP-only Cookie に格納し、XSS攻撃から保護

認証済みユーザーのみがアクセスできる保護ルートを Expressミドルウェアで制御

トークンが失効しても Axiosのインターセプター により自動でリフレッシュ可能

## 📊 データの視覚化（Chart.js + ag-Grid）
Chart.js を用いて映画の統計情報や評価の推移を視覚的に表示

ag-Grid により、ページング・フィルター・並べ替え機能付きのデータテーブルを実現

ユーザーに優しいレスポンシブデザインで、デスクトップとモバイル両対応

## 📁 モジュール構成と保守性の高さ
フロントエンドとバックエンドを 完全に分離（React + Express）

API通信や認証処理を api.jsx・setInterceptors.jsx に分離し、責務分割と可読性 を実現

Express 側も routes/, middleware/ などでディレクトリ構成を整理

## 📜 APIドキュメントの自動生成（Swagger）
/docs にアクセスするだけで、すべてのAPIエンドポイントと仕様を確認可能

OpenAPI準拠により、フロント・バック間の連携がスムーズに

今後のチーム開発や外部公開を見据えた設計

## 🔐 HTTPS 対応ローカル開発
OpenSSL を用いて、自己署名証明書による HTTPS ローカル開発環境を構築

## 🔁 自動トークン更新の高度な認証処理
setInterceptors.jsx にて Axiosインターセプターをカスタム実装

アクセストークンの有効期限切れ時、/user/refresh エンドポイントで自動リフレッシュ

リクエスト待機キュー (failedQueue) を用いて並列リクエストを正しく処理

ログイン状態は AuthContext.jsx によりアプリ全体でグローバル管理され、状態が即座に反映される

## 🧩 UI/UX設計の工夫
ログイン未認証時にはプロフィールに自動リダイレクト

profile.jsx 内でログインしていないと /login に自動転送される

App.jsx のナビゲーションバーには ログイン状態に応じて表示を変更（ユーザー名・ログアウトメニュー）

404 Not Found ページにも自動リダイレクト処理を実装し、ユーザー迷子を防止

## 🔐 セキュアなJWT認証（アクセストークン + リフレッシュトークン）
user.js にて、JWTのアクセストークンとリフレッシュトークンをhttpOnly Cookieに分離して保存。

トークンは/refreshで安全に更新、/logoutで失効。

verifyUser.js ミドルウェアで保護ルートにアクセス制限。

## 🧠 高度なトークンバリデーション設計
Cookieに保存されたトークンを 完全にサーバー側でのみ管理（XSS対策）

refreshToken 再利用の検出・拒否ロジックあり（user.refresh_token の使い捨て管理）

## 📚 SwaggerによるAPIドキュメントの自動生成
swagger-ui-express を使用し /docs から 全てのエンドポイントをGUI上で確認可能

OpenAPI仕様に沿った openapi.json を手動または自動で管理可能

---


## 🙌 Special Thanks

本プロジェクトは [QUT CAB230](https://www.qut.edu.au/) の課題をベースに構築されました。


