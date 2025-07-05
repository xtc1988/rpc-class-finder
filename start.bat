@echo off
chcp 65001 > nul
echo ======================================
echo RPC Class Finder 起動スクリプト
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
    pause
    exit /b 1
)

echo [OK] Node.jsがインストールされています
node --version
echo.

REM node_modulesが存在するか確認
if not exist "node_modules" (
    echo [情報] 依存関係をインストールしています...
    echo これには数分かかる場合があります。
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo [エラー] 依存関係のインストールに失敗しました。
        pause
        exit /b 1
    )
    echo.
    echo [OK] 依存関係のインストールが完了しました！
    echo.
) else (
    echo [OK] 依存関係は既にインストールされています
    echo.
)

echo ======================================
echo サーバーを起動しています...
echo ======================================
echo.
echo 5秒後にブラウザが自動的に開きます...
echo.
echo 終了するには、このウィンドウを閉じるか
echo Ctrl+C を押してください。
echo.

REM 5秒待ってからブラウザを開く
timeout /t 5 /nobreak > nul
start http://localhost:3000

REM サーバーを起動
npm run dev:renderer