import { describe, it, expect } from "vitest";
import { baseParse } from "../src/parse";
import { generate } from "../src/codegen";
import { transform } from "../src/transform";

describe("Codegen", () => {

  // 解析 String 
  it('string', () => {

    const ast = baseParse('hi')
    transform(ast, {})
    const { code } = generate(ast)
    // 断言
    // 使用快照测试 -> 把 code 拍个照片， 然后进行对比
    // 1. 抓 bug 
    // 2.  更新 快照
    // 生成 snapshot 文件夹，存放 快照
    expect(code).toMatchSnapshot()
  })


  it('interpolation', () => {
    const ast = baseParse('{{ message }}')
    transform(ast, {})
    const { code } = generate(ast)
    expect(code).toMatchSnapshot()
  })
});
