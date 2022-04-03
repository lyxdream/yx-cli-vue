# 实现一个简易的vue-cli4脚手架

## 目录结构
.
├── README.md
├── lerna.json
├── note.md
├── package-lock.json
├── package.json
├── packages
│   ├── yx-cli
│   │   ├── README.md
│   │   ├── bin
│   │   │   └── vue.js
│   │   ├── lib
│   │   │   ├── Creator.js
│   │   │   ├── Generator.js
│   │   │   ├── GeneratorAPI.js
│   │   │   ├── PromptModuleAPI.js
│   │   │   ├── create.js
│   │   │   ├── options.js
│   │   │   ├── promptModules
│   │   │   │   └── vueVersion.js
│   │   │   └── util
│   │   │       ├── createTools.js
│   │   │       ├── mergeDeps.js
│   │   │       ├── normalizeFilePaths.js
│   │   │       └── writeFileTree.js
│   │   ├── package-lock.json
│   │   └── package.json
│   ├── yx-cli-shared-utils
│   │   ├── README.md
│   │   ├── index.js
│   │   ├── lib
│   │   │   ├── module.js
│   │   │   └── pluginResolution.js
│   │   └── package.json
│   └── yx-cli-test
│       ├── 1.commander.js
│       ├── 2.inquirer.js
│       ├── 3.execa.js
│       ├── 4.chalk.js
│       ├── 5.isbinaryfile.js
│       ├── 6.ora.js
│       ├── 7.ejs.js
│       ├── 8.call.js
│       ├── README.md
│       ├── package.json
│       └── template
│           ├── assets
│           │   └── 2.png
│           ├── components
│           │   └── HelloWord.vue
│           └── main.js
└── yarn.lock

## 实现的核心功能




## 如何开发项目

### 安装依赖

```bash
yarn
```
### 添加软连接

```
yarn link
```
## 如何运行项目

### 查看帮助命令

```
lyx-cli --help
```
可以看到如下提示：

```
Usage: lyx-cli <command> [options]

Options:
  -V, --version      output the version number
  -h, --help         display help for command

Commands:
  create <app-name>  create a new project powered by vue-cli-service
  help [command]     display help for command

```

### 运行以下命令来创建一个新的vue项目：

```bash
lyx-cli create <app-name>或npm run create <app-name>
```


你会被提示选取一个 preset。你可以选默认的包含了基本的 Babel + ESLint 设置的 preset，也可以选“手动选择特性”来选取需要的特性。

如果选择了Manually select features会有一个选择feature提示：Choose Vue version


选择2.x或者3.x之后，会看到以下提示

运行
```
cd hello
npm run serve
```








 