# RPC Class Finder

RPC ClassからJavaScript Classとファイルパスを検索するウェブアプリケーション。

## 🚀 簡単スタートガイド

### 初心者の方はこちら！

1. **Node.jsをインストール**
   - [Node.js公式サイト](https://nodejs.org/)からLTS版をダウンロード
   - インストーラーを実行してインストール

2. **プロジェクトをダウンロード**
   - 「Code」ボタン → 「Download ZIP」でダウンロード
   - ZIPファイルを解凍

3. **初回セットアップ**
   - `setup.bat` をダブルクリック
   - 自動で必要なファイルがインストールされます

4. **アプリを起動**
   - `start.bat` をダブルクリック
   - ブラウザが自動で開きます

### 既に環境が整っている方

```bash
# リポジトリのクローン
git clone https://github.com/YOUR_USERNAME/rpc-class-finder.git
cd rpc-class-finder

# 依存関係のインストール
npm install

# アプリを起動
npm run dev:renderer
```

## ✨ 機能

- 🔍 **RPC Class検索**: RPC Classを入力してJavaScript Classとファイルパスを検索
- 🎨 **オートコンプリート**: 入力に応じて自動で候補を表示
- 🌙 **テーマ切り替え**: ライト/ダークテーマ対応
- 📝 **CSVデータ編集**: 簡単にCSVファイルでデータを管理
- 📋 **パスコピー**: ファイルパスをワンクリックでコピー

## 📁 CSVデータの編集

`public/csv/` フォルダ内のファイルを編集してデータをカスタマイズできます：

- `rpc-mappings.csv` - RPC Name と RPC Class のマッピング
- `js-mappings.csv` - RPC Name、JS Class、File Path のマッピング

ファイルを編集後、アプリの「更新」ボタンをクリックすると新しいデータが読み込まれます。

## 🛠️ 技術スタック

- **React** - UIライブラリ
- **TypeScript** - 型安全な開発
- **Material-UI** - モダンなUIコンポーネント
- **Vite** - 高速ビルドツール
- **Papa Parse** - CSVパーサー

## 📄 CSVファイルフォーマット

### rpc-mappings.csv
```csv
rpc_name,rpc_class
testRI,jp.co.testRIclass
userManagementRI,jp.co.userManagementRIclass
```

### js-mappings.csv
```csv
rpc_name,js_class,file_path
testRI,test_js,test\common\test_js.js
userManagementRI,UserManagement,src\modules\user\UserManagement.js
```

## 💻 開発者向け

### テスト実行
```bash
npm test                # テスト実行
npm run test:coverage   # カバレッジ付きテスト
```

### コード品質チェック
```bash
npm run lint            # ESLint実行
npm run lint:fix        # 自動修正
```

## 📁 プロジェクト構造

```
rpc-class-finder/
├── start.bat              # アプリ起動用バッチファイル
├── setup.bat              # 初回セットアップ用
├── public/csv/            # CSVデータファイル
│   ├── rpc-mappings.csv   # RPCマッピング
│   └── js-mappings.csv    # JSマッピング
├── src/
│   ├── renderer/          # Reactアプリケーション
│   └── shared/            # 共有型定義
└── package.json           # プロジェクト設定
```

## 🔧 トラブルシューティング

### アプリが起動しない場合
1. Node.jsがインストールされているか確認
2. `setup.bat`を再実行
3. インターネット接続を確認

### サジェストが表示されない場合
1. CSVファイルのフォーマットを確認
2. アプリの「更新」ボタンをクリック
3. ブラウザをリロード

## 📜 ライセンス

MIT License

## 🚀 貢献

プルリクエストやイシューの報告をお待ちしています！