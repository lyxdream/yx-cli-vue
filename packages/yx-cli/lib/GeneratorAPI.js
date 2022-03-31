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
  }
  /**
   * 
   * @param {*} source 模板目录的名称
   * @param {*} addtionalData 额外的数据对象
   */
  render(source,addtionalData){
  }
  extendPackage(){

  }
}
module.exports = GeneratorAPI