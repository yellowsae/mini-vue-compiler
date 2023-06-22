import { describe, it, expect } from "vitest";
import { baseParse } from "../src/compiler";
import { transform } from "../src/transform";
import { NodeTypes } from "../src/ast";

describe("transform", () => {
  it('happly patch', () => {

    const ast = baseParse("<div>hi, {{message}}</div>")
    // 传入 transform 
    // transform 修改 hi, 为 hi, mini-vue

    // 1. 创建 plugin -> 修改 text 的值 
    const plugin = (node: any) => {
      // 接收一个 node 
      if (node.type === NodeTypes.TEXT) {
        node.content = 'hi, mini-vue'
      }
    }

    // 2. 传入 修改 div 为 p 标签的  plugin 
    const changeDivPlugin = (node: any) => {
      if (node.type === NodeTypes.ELEMENT) {
        // 修改 div 标签 
        node.tag = 'p'
      }
    }


    transform(ast, {
      // 传入的 options
      // 具有一个 nodeTransformer 的数组,  []  把 要修改数据的 plugin 传入
      // transform 函数的执行 会去调用 plugin() 把 node 节点传回来
      // 这样就可以在外部，处理需要修改的节点 -> 
      // 在实现 runtime-core 时 导出的 createApp renderer 函数都使用了类似方法
      nodeTransforms: [plugin, changeDivPlugin]
    })

    // 验证 是否发生变化 
    const nodeText = ast.children[0].children[0]
    expect(nodeText.content).toBe('hi, mini-vue')
    expect(ast.children[0].tag).toBe('p')
  })
});
