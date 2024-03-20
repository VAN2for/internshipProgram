# 安装使用

### 安装依赖
```cmd
npm install
```

### 环境变量配置
- 配置环境变量PLAYSMART_PATH，地址为playsmart根目录，例：C:\works\playable-dev\playsmart
- 配置环境变量path，地址为vscode根目录，例：C:\Users\s\AppData\Local\Programs\Microsoft VS Code
- 安装npm install -g jszip

### 批处理运行 或 nodejs 运行
- `windows` start-win-publish.bat
- `mac` start-mac-publish.command
- `windows or mac` node ./editorservice/StartService.js --publish

# 目录结构
```
├── engine      引擎
├── libProject  库项目，用于开发组件
├── output      发布文件夹，把开发的组件发布成js与d,ts
├── tempProject 模板项目，可直接使用
```

# 模块与组件列表
## 已有


### 组件（component）
1. BehaviourTemp：组件模板，用于复制粘贴
2. MainConfig：初始化相关组件，项目配置，一个项目挂一个在根节点即可
3. Layout：布局组件

### 管理器（manager）
1. MathMgr：数学计算管理器

### 模块（module）
1. PlaySmart：基本接口模块，包含PL通用接口(gameStart,install等）与初始化的过程（自动）
2. Print：彩色打印接口，可以打印彩色的文字

### btn组
1. Install：安装按钮，可设置自动缩放效果(DOWNLOAD_BTN_SCALE的配置需要修改

### start组
1. Main：项目代码填写部分