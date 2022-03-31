
const {isPlugin} = require('yx-cli-shared-utils')
const {GeneratorAPI} = require('./GeneratorAPI')
class Generator{
  /**
   * @param {*} context 项目目录
   * @param {*} pkg 项目的package.json内容  plugins插件的内容 [{ id, apply, options }]
   */
  constructor(context, {pkg,plugins}){
    this.context = context;
    this.pkg = pkg;
    this.plugins = plugins
    this.files = {};//生成器先把所有要生成的文件和文件内容放在files对象
    this.fileMiddlewares = [];//生成文件的中间件，每个文件都会向中间件里面插入中间件，然后中间件负责向this.files里面写文件
    this.allPluginIds = Object.keys(this.pkg.dependencies || {})
    .concat(Object.keys(this.pkg.devDependencies || {})).filter(isPlugin)

    const cliService = this.plugins.find(p=>p.id==='@vue/cli-service')
    this.rootOptions = cliService.options; //cliService的配置对象就是preset,也就是根配置
  }
  generate(){
    console.log('开始生成配置---')
    await initPlugins();//初始化插件
  }
  initPlugins(){
    let {rootOptions} = this;
    for(const plugin of this.plugins){
      const {id,apply,options} = plugin;
      const api = new GeneratorAPI(id,this,options,rootOptions)
      await apply(api,options,rootOptions)
    }
  }
}

module.exports = Generator