const path = require('path')
//提取调用目录
function extractCallDir() {
  const obj = {}
  Error.captureStackTrace(obj)
  console.log(obj.stack)
  const callSite = obj.stack.split('\n')[3]
  const namedStackRegExp = /\s\((.*):\d+:\d+\)$/
  let matchResult = callSite.match(namedStackRegExp)
  const fileName = matchResult[1]
  return path.dirname(fileName)
}

let result = extractCallDir()
console.log(result)