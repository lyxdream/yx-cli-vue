#!/usr/bin/env node

const program = require('commander');

program
.version(`yx-cli ${require('../package').version}`)
.usage('<command> [options]')


program
.command('create <app-name>')
.description('create a new project powered by vue-cli-service')
.option('--merge', 'Merge target directory if it exists')
.option('-f, --force', 'Overwrite target directory if it exists')
.action((name,cmd)=>{
    require('../lib/create')(name,cmd)
})

program.parse(process.argv)

