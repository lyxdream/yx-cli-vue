const Module = require('module');
const path = require('path');
// 改变加载的位置，从context 这个目录里面加载xx模块。
exports.loadModule = function(request,context){
   //context  D:\练习\练习代码库\yx-cli-vue\hello1
  //创建一个require方法 @vue/cli-service/generator  
 return Module.createRequire(path.resolve(context,'package.json'))(request)
}
