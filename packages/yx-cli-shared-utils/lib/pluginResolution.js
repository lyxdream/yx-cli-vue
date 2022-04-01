const pluginRE = /^@vue\/cli-plugin-/
exports.isPlugin = (id)=>{ //@vue/cli-service
  return pluginRE.test(id)
}
// @vue/cli-plugin-eslint=>eslint
exports.toShortPluginId = (id)=>{ 
  return id.replace(pluginRE,'')
}