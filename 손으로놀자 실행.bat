@echo off
chcp 949 >nul
rem 손으로 놀자를 "소리 자동 재생 허용" 창으로 엽니다 (클릭 없이 메인 화면 음악이 바로 나와요)
rem 게임 전용 프로필을 따로 써서, 크롬이 이미 켜져 있어도 이 설정이 적용돼요
set "GAME=%~dp0손으로놀자.html"
set "PROFILE=%LOCALAPPDATA%\son-game-browser"
set "BROWSER=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%BROWSER%" set "BROWSER=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%BROWSER%" set "BROWSER=%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
if not exist "%BROWSER%" set "BROWSER=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not exist "%BROWSER%" goto nobrowser
start "" "%BROWSER%" --autoplay-policy=no-user-gesture-required --user-data-dir="%PROFILE%" --no-first-run --no-default-browser-check --start-maximized "%GAME%"
exit /b
:nobrowser
echo 크롬이나 엣지를 찾지 못했어요. 손으로놀자.html 을 직접 열어 주세요.
pause
