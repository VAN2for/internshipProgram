# PS默认模板

#### 介绍
VideoTempPs，交互视频模板（PlaySmart开发）

#### 打包说明

当项目有修改，需要重新打包更新上线时，请按照以下流程操作：

1. 修改并提交代码
2. 在git上打tag，版本号格式为 v1.2.3.4，版本号将会更新到 StartScene.html 的版本占位符 `{{template-version}}` 中
3. 在当前目录下执行 `make` 命令，打出新zip包
4. 将新zip包上传更新线上包