#!/usr/bin/env node
const program = require('commander');
program
    .version(`zhang-cli 0.0.0}`)   //指定版本号
    .usage('<command> [options]') //指定使用方式

program
    .command('create <app-name>') //添加一个命令 create <表示必填参数>
    .description('create a new project powered by vue-cli-service') //  vue-cli-service 相当于react-scripts  封装build serve
    .action((name) => {
        console.log(name)
    })

program.parse(process.argv)