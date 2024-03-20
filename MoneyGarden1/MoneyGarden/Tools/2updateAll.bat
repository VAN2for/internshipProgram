@echo off
::ɾ�������ļ�
del /f /s /q /a %PLAYSMART_PATH%\output\TypeScripts\*.meta
rd /s /q %PLAYSMART_PATH%\output\Scripts\start
::�����ļ�����Ŀ��
cd ..
rd /s /q Scripts\custom
rd /s /q Scripts\libs
ROBOCOPY %PLAYSMART_PATH%\output\Scripts\custom  Scripts\custom /E
ROBOCOPY %PLAYSMART_PATH%\output\Scripts\libs  Scripts\libs /E
ROBOCOPY %PLAYSMART_PATH%\output\Editor  Editor /E
