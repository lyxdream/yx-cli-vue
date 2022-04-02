
const {isPlugin} = require('yx-cli-shared-utils')
const GeneratorAPI = require('./GeneratorAPI')
const normalizeFilePaths = require('./util/normalizeFilePaths')
const writeFileTree = require('./util/writeFileTree')
const ejs = require('ejs')
class Generator{
  /**
   * @param {*} context 项目目录
   * @param {*} pkg 项目的package.json内容  plugins插件的内容 [{ id, apply, options }]
   */
  constructor(context, {pkg= {},plugins = []}){
    this.context = context;
    this.pkg = pkg;
    this.plugins = plugins
    this.files = {};//生成器先把所有要生成的文件和文件内容放在files对象
    this.fileMiddlewares = [];//生成文件的中间件，每个文件都会向中间件里面插入中间件，然后中间件负责向this.files里面写文件
    this.allPluginIds = Object.keys(this.pkg.dependencies || {})
    .concat(Object.keys(this.pkg.devDependencies || {})).filter(isPlugin)

    const cliService = this.plugins.find(p=>p.id==='@vue/cli-service')
    this.rootOptions = cliService?cliService.options:{}; //cliService的配置对象就是preset,也就是根配置
  }

  async generate(){
    console.log('开始生成配置---')
    await this.initPlugins();//初始化插件.修改fileMiddlewares和pkg
    this.extractConfigFiles();//提取package.json的配置文件到单独的配置文件
    await this.resolveFiles()  //wait for file resolve
    this.sortPkg() //对依赖包进行排序，重写package.json
    this.files['package.json'] = JSON.stringify(this.pkg, null, 2) + '\n'
    await writeFileTree(this.context,this.files) //write/update file tree to disk

    
  }
  hasPlugin(_id){
    return [
      ...this.plugins.map(p=>p.id),
      ...this.allPluginIds
    ].some(id=>id===_id)
  }
  sortPkg(){
    console.log('对依赖包进行排序')
  }
  // 真正执行中间件
  async resolveFiles(){
    for(const middleware of this.fileMiddlewares){
      await middleware(this.files,ejs.render)     //执行fileMiddlewares里面的函数
    }
    // 把 /替换为 \
    normalizeFilePaths(files)
  }
  extractConfigFiles(){
    console.log('提取package.json的配置文件到单独的配置文件')
  }
  async initPlugins(){
    let {rootOptions} = this;
    for(const plugin of this.plugins){
      const {id,apply,options} = plugin;
      const api = new GeneratorAPI(id,this,options,rootOptions)
      await apply(api,options,rootOptions)
    }
  }
}

module.exports = Generator