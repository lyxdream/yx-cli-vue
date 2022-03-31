const fs = require('fs-extra');
const path = require('path');
module.exports = async function (dir,files){
  Object.keys(files).forEach(name=>{
    const filePath = path.join(dir,name)  //D:\练习\练习代码库\yx-cli-vue\hello1\package.json
    // 确保目录的存在,如果目录结构不存在,就创建一个
    fs.ensureDirSync(path.dirname(filePath))
    fs.writeFileSync(filePath,files[name])
  })
}