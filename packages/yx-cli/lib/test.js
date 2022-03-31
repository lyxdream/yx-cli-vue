// run('git add -A')

// function run(command,args){
//   //在context目录下执行命令
//   if (!args) { [command, ...args] = command.split(/\s+/) }
//   //git [ 'add', '-A' ]
//   return execa(command,args,{cwd:this.context})
//   // console.log(command,args)
//   // console.log(command.split(/\s+/) )
//  }



// var heapSize = 1
// // 原地建堆
// function buildHeap(items) {
//     while(heapSize < items.length - 1) {  //5
//         heapSize ++
//         heapify(items, heapSize)
//     }
// }

// function heapify(items, i) {
//     // 自下而上式堆化
//     while (Math.floor(i/2) > 0 && items[i] < items[Math.floor(i/2)]) {  
//         swap(items, i, Math.floor(i/2)); // 交换 
//         i = Math.floor(i/2); 
//     }
// }  

// function swap(items, i, j) {
//     let temp = items[i]
//     items[i] = items[j]
//     items[j] = temp
// }

// // 测试
// var items = [,5, 2, 3, 4, 1]
// buildHeap(items)
// console.log(items)



[
    'module',
   'pluginResolution',
].forEach(m => {
 
})
console.log(exports,'----')
// Object.assign(exports, require(`./lib/pluginResolution`))