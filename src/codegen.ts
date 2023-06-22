// 写 generate 的逻辑

// generate 功能， 把 ast 树 编译为 render 函数  


export function generate(ast: any) {

  let context: any = createCodegenContext()

  const { push } = context
  // let code = ""
  // code += 'return '
  push('return ')
  console.log(context.code, 'context.code')

  const functionName = 'render'
  const args = '_ctx, _cache'

  push(`function ${functionName} (${args}) { \n`)
  push(`return `)

  genNode(context, ast)

  push('}')

  return {
    code: context.code
  }

}


function genNode(context: any, ast: any) {
  const { push } = context
  push(`'${ast.codegenNode.content}'`)
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source: string) {
      context.code += source
    }
  }
  return context
}
