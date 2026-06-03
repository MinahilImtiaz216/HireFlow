@echo off
echo Starting RecruitHub Backend...
cd /d "%~dp0backend"
dotnet restore
dotnet run
pause
