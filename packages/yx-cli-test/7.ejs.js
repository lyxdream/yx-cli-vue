const path = require('path');  //处理路径的
const fs = require('fs'); //读写文件的
const ejs = require('ejs'); //渲染模版的
const globby = require('globby') //根据模式字符串匹配文件名
const slash = require('slash') //把路径的\转换成/
const { isBinaryFileSync } = require('isbinaryfile');
let source = path.join(__dirname, 'template'); //模版目录
console.log(source,'---')
///Users/yinxia/Desktop/架构学习/yx-cli-vue/packages/yx-cli-test/template
;(async function () {
    // **/* 任意目录的任意文件
    const _files = await globby(['**/*'], { cwd: source })
    console.log(_files) //[ 'main.js', 'assets/2.png', 'components/HelloWord.vue' ]
    let files = {};
    for (const rawPath of _files) {
        // debugger
        const sourcePath = slash(path.resolve(source, rawPath)) //每个文件的绝对路径
        if(isBinaryFileSync(sourcePath)){
            const content = fs.readFileSync(sourcePath)
            files[sourcePath] = content;
        }else{
            const template = fs.readFileSync(sourcePath, 'utf8') //读取这个模版
            const content = ejs.render(template, {
                rootOptions: { vueVersion: '2' }
            })
            files[sourcePath] = content;
        } 
    }
    console.log(files);
})()