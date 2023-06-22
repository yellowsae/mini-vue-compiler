import { NodeTypes } from "./ast"

export function transform(ast: any, options: any) {

  // // 取出 options 中的 nodeTransforms
  // const { nodeTransforms } = options

  // // 执行 plugin ，把 ast 传入 node 传出去 


  // 构造 context
  const context = createTransformContext(ast, options)

  // 实现思路 
  // 1. 遍历 - 深度优先遍历 


  // 1. 深度优先遍历 
  traverseNode(ast, context)
}


function createTransformContext(ast: any, options: any) {
  return {
    nodeTransforms: options.nodeTransforms || []
  }
}


function traverseNode(node: any, context: any) {

  // 2. 修改 text content 
  // if (node.type === NodeTypes.TEXT) {
  //   // 对内容进行修改 
  //   node.content = 'hi, mini-vue'
  // }

  // 执行传入的 nodeTransforms中的 plugin 
  const nodeTransforms = context.nodeTransforms

  nodeTransforms.forEach((plugin: any) => {
    plugin(node)  // 执行 plugin 把对应 node 传出去 
  })

  // 重构 抽离 处理 深度优先遍历的 children 逻辑 
  traverseChildren(node, context)
}

function traverseChildren(node: any, context: any) {
  const children = node.children
  if (children) {
    children.forEach((child: any) => {
      // 递归， 深度优先遍历 
      traverseNode(child, context)
    })
  }
} 
