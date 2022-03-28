
  exports.defaultPreset = {
    useConfigFiles: false,  //是否把babel eslint postcss 这些包对应的配置项是否放在单独的文件，false的话放在package.json里面
    cssPreprocessor: undefined, //默认没有配置css预处理器
    plugins: {
        '@vue/cli-plugin-babel': {}, //babel  官方提供的插件前缀是固定的 @vue/cli-plugin-
        '@vue/cli-plugin-eslint': { //eslint
            config: 'base', 
            lintOn: ['save'] //保存的时候进行lint检查
        }
    }
}
//预设
exports.defaults = {
    presets: {
    'default': Object.assign({ vueVersion: '2' }, exports.defaultPreset),
    '__default_vue_3__': Object.assign({ vueVersion: '3' }, exports.defaultPreset)
    }
}
