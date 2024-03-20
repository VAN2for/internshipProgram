::version_5.0
@echo off&setlocal EnableDelayedExpansion
::获取文件夹名称
cd..
set lj=%cd%
set lj=%lj:\= %
for %%a in (%lj%) do set pack_name=%%a
cd Build
set release_path=%cd%
::删除原文件夹，重命名新文件夹
rd /q /s %pack_name%
ROBOCOPY PublishProject %pack_name% /E
del %pack_name%\folder.ignore
cd %pack_name%
rename StartGame.html %pack_name%.html
::删除调试版的代码
del js\game-scripts-debug*.* /f/s/q/a
cd..
::删除原压缩包，创建压缩包
del %pack_name%.zip
"C:\Program Files\Bandizip\Bandizip.exe" a -storeroot:yes "%pack_name%.zip" "%pack_name%"