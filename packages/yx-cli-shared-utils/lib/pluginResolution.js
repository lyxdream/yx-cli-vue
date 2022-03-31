const pluginRE = /^@vue\/cli-plugin-/
exports.isPlugin = (id)=>{ //@vue/cli-service
  return pluginRE.test(id)
}