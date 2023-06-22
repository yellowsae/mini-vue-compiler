import { describe, it, expect } from "vitest";
import { baseParse } from "../src/parse";
import { NodeTypes } from "../src/ast";

describe('compiler', () => {

  it('compiler-parse-union', () => {
    // 三种联合类型 
    const ast = baseParse('<div>hi, {{ message }}</div>')

    expect(ast).toEqual({
      children: [
        {
          type: NodeTypes.ELEMENT,
          tag: 'div',
          children: [
            {
              type: NodeTypes.TEXT,
              content: 'hi, '
            },
            {
              type: NodeTypes.INTERPOLATION,
              content: {
                type: NodeTypes.SIMPLE_EXPRESSION,
                content: 'message'
              }
            }
          ]
        }
      ]
    })
  })
})
