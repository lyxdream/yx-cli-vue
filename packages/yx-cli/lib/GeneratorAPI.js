const fs = require('fs')
const ejs = require('ejs')
const path = require('path')
const globby = require('globby');
const { isBinaryFileSync } = require('isbinaryfile')
let {toShortPluginId} = require('yx-cli-shared-utils');
const mergeDeps = require('./util/mergeDeps')
const isString = val=>typeof val === 'string'
const isObject = val=>typeof val === 'object'
class GeneratorAPI{
  /**
   * @param {*} id  插件的id
   * @param {*} generator 生成器函数
   * @param {*} options 插件的选项
   * @param {*} rootOptions 根选项，也就是perset
   */
  constructor(id,generator,options,rootOptions){
    this.id = id;
    this.generator = generator;
    this.options = options;
    this.rootOptions = rootOptions;
    this.pluginsData = generator.plugins
    .filter(({ id }) => id !== `@vue/cli-service`)
    .map(({ id })=>({name:toShortPluginId(id)}))
    //@vue/cli-plugin-eslint=>eslint
  }
  _injectFileMiddleware(middleware){
    this.generator.fileMiddlewares.push(middleware)
  }
  _resolveData(additionalData){
    return Object.assign({
      options:this.options, //此插件对应得配置对象
      rootOptions:this.rootOptions,//根配置，preset
      plugins:this.pluginsData
    },additionalData)
  }
  hasPlugin (id) {
    return this.generator.hasPlugin(id)
  }
  /**
   * 
   * @param {*} source 模板目录的名称
   * @param {*} additionalData 额外的数据对象
   */
  render(source,additionalData = {}){
    const baseDir = extractCallDir(); //提取调用目录      m m
    console.log(baseDir,'---baseDir')
    console.log(source,'--source---')
    
    if(isString(source)){
      source = path.resolve(baseDir,source);
      //插入文件中间件 此处只是暂存中间件函数，并没有执行
      this._injectFileMiddleware(async (files)=>{
        console.log(files, '---files')
        const data = this._resolveData(additionalData)
        const _files = await globby(['**/*'],{cwd:source});
        console.log('_files',_files)
        for(const rawPath of _files){
            const targetPath = rawPath.split('/').map(filename=>{
                if (filename.charAt(0) === '_' && filename.charAt(1) !== '_') {//_gitignore=>.gitignore
                  return `.${filename.slice(1)}`
                }
                return filename
            }).join('/')
            //模板文件夹里原始文件得绝对路径
            const sourcePath = path.resolve(source,rawPath) 
            // /Users/yinxia/Desktop/架构学习/yx-cli-vue/hello7/node_modules/@vue/cli-service/generator/template/src/main.js
            const content = renderFile(sourcePath,data) //内容
            //不管是二进制文件还是普通得文本都暂存到files对象上去
            files[targetPath] = content
        }
      })
    }
  }
  extendPackage(fields){
    const pkg = this.generator.pkg;
    const toMerge = fields;
    for(const key in toMerge){
        const value = toMerge[key];
        let existing = pkg[key]
        if(isObject(value)&&(key === 'dependencies' || key === 'devDependencies')){
           pkg[key] = mergeDeps(existing||{},value)
        }else {
           pkg[key] = value
        }
    }
  }
}
function renderFile(name,data){
  console.log(name,'-----name,data--')
  if(isBinaryFileSync(name)){
    return fs.readFileSync(name)
  }
  let template = fs.readFileSync(name,'utf8') //读取这个模版
  return ejs.render(template,data)
}
//提取调用目录
function extractCallDir() {
  const obj = {}
  Error.captureStackTrace(obj)
  const callSite = obj.stack.split('\n')[3]
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
  let matchResult = callSite.match(namedStackRegExp)
  const fileName = matchResult[1]
  return path.dirname(fileName)
}

module.exports = GeneratorAPI