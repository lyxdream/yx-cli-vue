const slash = require('slash')
//window 的是 \  mac是/ 都转换成/
module.exports = function normalizeFilePaths (files) {
  Object.keys(files).forEach(file => {
    const normalized = slash(file)
    if(file!==normalized){
      files[normalized] = files[file]
      delete files[file]
    }
  })
  return files
}
