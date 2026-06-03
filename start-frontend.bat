@echo off
echo Starting RecruitHub Frontend...
cd /d "%~dp0frontend"
call npm install
call ng serve --open
pause
