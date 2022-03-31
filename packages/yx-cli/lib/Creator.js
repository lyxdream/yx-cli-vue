
const inquirer = require('inquirer');
const cloneDeep = require('lodash.clonedeep')
let {defaults} =  require('./options')
let PromptModuleAPI = require('./PromptModuleAPI')
const writeFileTree = require('./util/writeFileTree')
let {chalk, execa,loadModule} = require('yx-cli-shared-utils')
let Generator = require('./Generator')
const isManualMode = answers => answers.preset === '__manual__' //是否手动选择特性
class Creator{
   constructor(name,context,promptModules){
        this.name = name;
        this.context = context
        const { presetPrompt, featurePrompt } = this.resolveIntroPrompts() //解析选择项的数据
        this.presetPrompt = presetPrompt;
        this.featurePrompt = featurePrompt; //目前是一个空数组
        this.injectedPrompts = []  //当前选择了某个特性后，这个特性刻印会总价新的选择项 unit 
        this.promptCompleteCbs = [] //当选择选项所有后的回调数组
        this.run = this.run.bind(this);
        const promptAPI = new PromptModuleAPI(this)
        promptModules.forEach(m => m(promptAPI))  //调用vueVersion.js里面的函数
   }
   run(command,args){
    //在context目录下执行命令
    if (!args) { [command, ...args] = command.split(/\s+/) }
    return execa(command,args,{cwd:this.context})
   }
   async create(){
       const {name,context,run} = this; //name 要创建的项目名 context所在目录
       let preset = await this.promptAndResolvePreset()
       preset = cloneDeep(preset)
       //@vue/cli-service  核心包，自带webpack得配置，build，serve的命令
       //@vue/cli-service  非常特殊，它的选项也被称为项目的选项，或者说根选项 rootOptions
       preset.plugins['@vue/cli-service'] = Object.assign({projectName:name},preset)
       console.log(`✨  Creating project in ${chalk.yellow(context)}.`)

     // 写入 package.json
        const pkg = {  //将要生成的package.json内容
            name,
            version: '0.1.0',
            private:true,
            devDependencies: {}
        }
        const deps = Object.keys(preset.plugins) //获取各个插件的名称
        deps.forEach((dep)=>{
        let { version } = preset.plugins[dep]
        if(!version){
            version = 'latest'
        }
        pkg.devDependencies[dep] = version;
        })
        //写入 package.json
        await writeFileTree(context,{
            'package.json':JSON.stringify(pkg,null,2)
        })


       // 安装插件
       console.log(`🗃  Initializing git repository...`)
       await run('git init') //初始化git仓库
       console.log(`⚙\u{fe0f}  Installing CLI plugins. This might take a while...`)
       await run('npm install') //安装插件

        //调用生成器
       console.log(`🚀  Invoking generators...`) 
       const plugins = await this.resolvePlugins(preset.plugins)
       console.log(plugins,'--plugins---plugins')

       //run 生成器
       const generator = new Generator(context, {pkg,plugins})
       await generator.generate(); //生成代码
   }
   //写入 package.json
   async createPackageFile(){
   
   }
   //解析插件  [{ id, apply, options }]
   resolvePlugins(rawPlugins){
    const plugins = [];
    for(const id of Object.keys(rawPlugins)){
        const apply  = loadModule(`${id}/generator`,this.context) //插件的generator导出的文件导出的函数
        let options = rawPlugins[id] || {}
        plugins.push({
            id,
            apply,
            options
        })
    }
    return plugins
   }
   resolvePreset(name){
       //如 default
        return this.getPresets()[name]
   }
   //弹出并解析预设
   async promptAndResolvePreset(answers = null){
        if (!answers) {
            answers = await inquirer.prompt(this.resolveFinalPrompts())
        }   
        // console.log(answers,'answersanswers')
        let preset;
        if(answers.preset&&!isManualMode(answers)){
            //如果不是手动选择预设
            preset = await this.resolvePreset(answers.preset)
        }else{
            preset = {
                plugins:{} //默认没有任何插件
            }
            answers.features = answers.features || []
            this.promptCompleteCbs.forEach(cb => cb(answers, preset)) //执行回调函数里面的方法 
            // 执行 preset.vueVersion = answers.vueVersion
            // { preset: '__manual__', features: [ 'vueVersion' ], vueVersion: '2' }  answers
            // { plugins: {}, vueVersion: '3' } ---preset
        }
        return preset;
   }
   resolveFinalPrompts(){
    this.injectedPrompts.forEach(prompt => {
        const originalWhen = prompt.when || (() => true)
        prompt.when = answers => {
            //如果是手动特性且answers里面有vueVersion才会弹出来
          return isManualMode(answers) && originalWhen(answers)
        }
      })
     const prompts = [  
        this.presetPrompt,  //先选预设 default vue3 amnual
        this.featurePrompt, //选择特性  Choose Vue version
        ...this.injectedPrompts, //不同的promptModules插入的选项  [ 2.x 3.x]
        // ...this.outroPrompts 
      ]
      return prompts
   }
   getPresets(){
        return Object.assign({},defaults.presets)
   }
   resolveIntroPrompts(){
    const presets = this.getPresets() //获取预设列表
    const presetChoieces = Object.entries(presets).map(([name,preset])=>{
        let displayName = name;
        if(name === 'default'){
            displayName = 'Default'
        }else if(name === '__default_vue_3__'){
            displayName = 'Default (Vue 3)'
        }
        return {
            name:displayName,
            value:name
        }
    })
    //[{name:"Default",value:"default"},{name:"Default (Vue 3)",value:"__default_vue_3__"}]
    const presetPrompt  = {
        name:'preset', //弹出的名称
        type:'list',
        message: `Please pick a preset:`,
        choices:[
            ...presetChoieces,
            {
                name: 'Manually select features', //手动选择特性
                value: '__manual__'
            }
        ]
    }
    const featurePrompt = {
        name:'features',//手动选择特性
        when:isManualMode,//如果when这个函数是true,就会弹出这个框，否则不弹出框
        type:"checkbox",
        message: 'Check the features needed for your project:',
        choices:[]
    }
    return {
        presetPrompt,
        featurePrompt
    }
  }
}

module.exports = Creator