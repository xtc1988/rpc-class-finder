#!/bin/bash

# エラーが発生したら即座に終了
set -e

echo "Building for GitHub Pages..."

# ビルドを実行
npm run build:gh-pages

# gh-pagesブランチに切り替え
git checkout gh-pages

# 現在のファイルをすべて削除（.gitを除く）
find . -maxdepth 1 ! -name '.git' ! -name '.' ! -name '..' -exec rm -rf {} +

# dist/rendererの内容をルートにコピー
cp -r dist/renderer/* .

# .gitignoreを作成（node_modulesなどを除外）
echo "node_modules/" > .gitignore
echo "src/" >> .gitignore
echo "dist/" >> .gitignore
echo "*.log" >> .gitignore

# 変更をコミット
git add -A
git commit -m "Deploy to GitHub Pages"

# プッシュ
git push origin gh-pages

# mainブランチに戻る
git checkout main

echo "Deployment complete!"
echo "Visit https://xtc1988.github.io/rpc-class-finder/ to see your site"