# RPC Class Finder - GitHub デプロイガイド

## 🚀 GitHubにアップロードする手順

### 1. GitHubアカウントの作成
- [GitHub.com](https://github.com/)でアカウントを作成

### 2. 新しいリポジトリを作成
1. GitHubにログイン
2. 右上の「+」→「New repository」をクリック
3. Repository name: `rpc-class-finder`
4. Description: `RPC ClassからJavaScript Classを検索するWebアプリ`
5. Public/Privateを選択
6. 「Create repository」をクリック

### 3. ローカルリポジトリをGitHubにプッシュ

```bash
# GitHubリポジトリのURLを設定（YOUR_USERNAMEを実際のユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/rpc-class-finder.git

# メインブランチにプッシュ
git push -u origin main
```

### 4. README.mdのURL更新
- README.md内の `YOUR_USERNAME` を実際のGitHubユーザー名に変更

### 5. GitHub Pagesでの公開（オプション）
1. リポジトリの「Settings」タブ
2. 左メニューの「Pages」
3. Source: 「Deploy from a branch」
4. Branch: 「main」、Folder: 「/ (root)」
5. 「Save」をクリック

## 📋 アップロード前チェックリスト

- [ ] Node.jsがインストールされている
- [ ] `setup.bat`でセットアップが正常に完了する
- [ ] `start.bat`でアプリが正常に起動する
- [ ] CSVファイルが正しく読み込まれる
- [ ] サジェスト機能が動作する
- [ ] 検索結果が正しく表示される

## 🛠️ トラブルシューティング

### プッシュ時の認証エラー
- Personal Access Tokenを使用する
- GitHub Desktop使用を検討

### ファイルサイズエラー
- `node_modules`が`.gitignore`に含まれていることを確認
- 大きなファイルがコミットされていないか確認

## 📞 サポート

問題が発生した場合は、GitHubのIssuesでお知らせください。