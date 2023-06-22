import { describe, it, expect } from "vitest";
import { baseParse } from "../src/compiler";
import { NodeTypes } from "../src/ast";
describe("compiler", () => {
  it('test', () => {
    expect(1).toBe(1);
  })


  it('compiler-parse-interpolation', () => {
    const ast = baseParse('{{ messaaage }}')
    // const ast = baseParse('<div></div>')
    expect(ast).toEqual({
      children: [
        {
          type: NodeTypes.INTERPOLATION,
          content: {
            type: NodeTypes.SIMPLE_EXPRESSION,
            content: 'messaaage'
          }
        }
      ]
    })
  })

  it('compiler-parse-element', () => {
    const ast = baseParse('<div></div>')
    expect(ast).toEqual({
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: 'div',
          children: []
        }
      ]
    })
  })

  it('compiler-parse-text', () => {
    const ast = baseParse('mess   age')
    expect(ast.children[0]).toStrictEqual({
      // 类型
      type: NodeTypes.TEXT,
      // 解析出来的内容
      content: 'mess   age',
    })
  })

});
