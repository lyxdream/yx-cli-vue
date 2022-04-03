
const path = require('path')
const {getPromptModules} = require('./util/createTools')
const Creator = require('./Creator')
/**
 * @description 创建项目
 * @param {string} projectName  项目的名称
 */
async function create(projectName){
    let cwd = process.cwd();//获取当前的工作目录
    let name = projectName; //项目名称
    let targetDir = path.resolve(cwd,name)
    // console.log(name,targetDir)
    //获取要弹出的项
    let promptModules = getPromptModules();
    const creator = new Creator(name,targetDir,promptModules)
    // console.log(promptModules)
    await creator.create()
}

module.exports = (...args)=>{
    return create(...args).catch(err=>{
        console.log(err)
    })
}