@echo off
chcp 65001 > nul
echo ======================================
echo RPC Class Finder 初回セットアップ
echo ======================================
echo.

REM Node.jsがインストールされているか確認
node --version > nul 2>&1
if %errorlevel% neq 0 (
    echo [エラー] Node.jsがインストールされていません。
    echo.
    echo Node.jsをダウンロードしてインストールしてください：
    echo https://nodejs.org/
    echo.
    echo 推奨: LTS版をダウンロードしてください
    echo.
    pause
    start https://nodejs.org/
    exit /b 1
)

echo [OK] Node.jsがインストールされています
node --version
echo.

echo npmのバージョン:
npm --version
echo.

echo ======================================
echo 依存関係をインストールしています...
echo ======================================
echo.
echo これには数分かかる場合があります。
echo お茶でも飲みながらお待ちください ☕
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo [エラー] インストール中にエラーが発生しました。
    echo.
    echo 以下を確認してください:
    echo 1. インターネットに接続されているか
    echo 2. ファイアウォールがnpmをブロックしていないか
    echo.
    pause
    exit /b 1
)

echo.
echo ======================================
echo [OK] セットアップが完了しました！
echo ======================================
echo.
echo 次のステップ:
echo 1. start.bat をダブルクリックしてアプリを起動
echo 2. CSVファイルを編集する場合は public/csv フォルダ内のファイルを編集
echo.
pause