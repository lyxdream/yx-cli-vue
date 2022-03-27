#!/usr/bin/env node

const program = require('commander');

program
.version(`yx-cli ${require('../package').version}`)
.usage('<command> [options]')


program
.command('create <app-name>')
.description('create a new project powered by vue-cli-service')
.action((appName)=>{
    console.log(appName,'------')
    require('../lib/create')(appName)
})

program.parse(process.argv)

