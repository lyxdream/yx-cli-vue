
const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer');
let {chalk} = require('yx-cli-shared-utils')
const {getPromptModules} = require('./util/createTools')
const Creator = require('./Creator')
/**
 * @description 创建项目
 * @param {string} projectName  项目的名称
 */
async function create(projectName,options){
    let cwd = process.cwd();//获取当前的工作目录
    let name = projectName; //项目名称
    let targetDir = path.resolve(cwd,name)
    // console.log(name,targetDir) 
    // 检测目录是否存在
    if (fs.existsSync(targetDir)&& !options.merge) {
        if (options.force) {
          //是否是强制创建，删除已有的
          await fs.remove(targetDir);
        } else {
          //提示用户是否确定要覆盖  配置询问的方式
          const { action } = await inquirer.prompt([
            {
              name: "action", //选择的结果
              type: "list", //展示方式
              message: `Target directory already exists Pick an action`,
              choices: [
                { name: "Overwrite", value: "overwrite" },
                { name: 'Merge', value: 'merge' },
                { name: "Cancel", value: false },
              ],
            },
          ]);
          if (!action) {
            return;
          } else if (action === "overwrite") {
            console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
            await fs.remove(targetDir);
          }
        }
      }
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