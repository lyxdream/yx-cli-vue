
const inquirer = require('inquirer');
let {defaults} =  require('./options')
let PromptModuleAPI = require('./PromptModuleAPI')
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
        const promptAPI = new PromptModuleAPI(this)
        promptModules.forEach(m => m(promptAPI))  //调用vueVersion.js里面的函数
   }
   async create(){
       let preset = await this.promptAndResolvePreset()
       console.log(preset,'---preset')
   }
   resolvePreset(name){
        return this.getPresets()[name]
   }
   //弹出并解析预设
   async promptAndResolvePreset(answers = null){
        if (!answers) {
            answers = await inquirer.prompt(this.resolveFinalPrompts())
        }   
        console.log(answers,'answersanswers')
        let preset;
        if(answers.preset&&!isManualMode(answers)){
            //如果不是手动选择预设
            preset = await this.resolvePreset(answers.preset)
        }else{
            preset = {
                plugins:{}
            }
            answers.features = answers.features || []
            this.promptCompleteCbs.forEach(cb => cb(answers, preset)) //执行回调函数里面的方法 
            // 执行 preset.vueVersion = answers.vueVersion
            // { preset: '__manual__', features: [ 'vueVersion' ], vueVersion: '2' }  answers
            // { plugins: {}, vueVersion: '3' } ---preset
        }
        console.log(preset,'---')
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