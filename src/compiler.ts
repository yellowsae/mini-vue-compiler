import { NodeTypes } from './ast';

export function baseParse(content: any) {

  const context = createParserContext(content)
  // { source: '{{message}}'}  // 使用 source: xxx  在构造解析

  return createRoot(parseChildren(context, ''))
}


function createParserContext(content: any) {
  return {
    source: content
  }
}


function createRoot(children: any) {
  return {
    children
  }
}


function parseChildren(context: any, parseTag: any) {
  const nodes = []

  let node;


  // 3. 当解析完 text 后，后面还有内容: {{message}}</div>
  // 这里定义一个死循环，让它一直去解析后面的内容 
  // 当 source 没有值时候结束循环
  // 当 遇到 </div> 结束标签时候 停止循环
  // 使用 isEnd() 封装
  // 传入 parseTag 解析好的标签
  while (!isEnd(context, parseTag)) {

    // 优化 当 {{ 开始时，再去解析
    if (context.source.startsWith('{{')) {
      node = parseInterpolation(context)
    } else if (context.source[0] === '<') {
      // 解析 element 
      // 判断第二个字符 是否是 a-z
      if (/[a-z]/i.test(context.source[1])) {
        // console.log("parse Element") // 命中 说明解析Element
        // 解析 Element 的逻辑parseElement
        // 把返回值放到 node 中
        node = parseElement(context)
      }
    }

    // 当 node 没有值时 
    // console.log(node) // 当 node 即不是 插值 | element 时, node 为 undefined 
    if (!node) {
      // 说明为 text 类型 
      node = parseText(context)
    }
    nodes.push(node)  // 解决 联合解析 
  }
  return nodes
}


function isEnd(context: any, parseTag: any) {

  let s = context.source
  /** 
   * 因为这里是写死的标签 </div> 
   * 分析：这个div 是 解析 element.children 时 一开始的 <￥>, 所以可以基于这个开始的标签 进行验证
   * 解决： 在  解析 element.children 传入解析好的 element.tag
   * 
  */
  // 当 parseTag 为空时不用管
  if (parseTag && s.startsWith(`</${parseTag}>`)) {
    return true
  }
  // 1. 当 source 有值时候，返回 false
  return !context.source
}



const enum TagType {
  Start,
  End
}


// 解析 Text 
function parseText(context: any) {


  let endIndex = context.source.length
  // 如果 context.source 有 {{
  let endToken = "{{"
  // 判断 context.source 中是否有 {{ 
  let index = context.source.indexOf(endToken)

  // 如果 text 有 {{
  if (index !== -1) {
    // 修改 endIndex 的值
    endIndex = index
  }

  // 获取 text 的内容
  // const content = context.source.slice(0, context.source.length)
  const content = context.source.slice(0, endIndex)  // 只获取文本 而不是获取插值类型

  // 2. 删除 text 的内容 删除 context.source 
  advanceBy(context, content.length)
  // 封装 
  return {
    type: NodeTypes.TEXT,
    content: content
  }
}


// 解析 Element 
function parseElement(context: any) {
  // 1. 解析 tag 

  // 解析函数 parseTag
  const element: any = parseTag(context, TagType.Start)


  // 1-1 element 具有 children 属性,  因为 element 可能是嵌套的 
  // 所以 这里 递归调用 parseChildren 
  element.children = parseChildren(context, element.tag)

  // console.log(element, 'element')

  // 2. 删除解析后的 context.source
  // 此时 context.source 为 '</div>', 需要再次调用 parseTag 删除 '</div>'
  // 二次调用 
  parseTag(context, TagType.End)

  return element
}


// 就是解析 tag
function parseTag(context: any, type: TagType) {
  // 1. 解析 div
  const match: any = /^<\/?([a-zA-Z][^\s/>]*)/.exec(context.source)

  const tag = match[1]


  // 2. 删除处理完成的代码 
  advanceBy(context, match[0].length)

  advanceBy(context, 1)

  if (type === TagType.End) return

  return {
    type: NodeTypes.ELEMENT,
    tag: tag  // 解析出来的 tag 
  }
}


function advanceBy(context: any, numberOfCharacters: number) {
  context.source = context.source.slice(numberOfCharacters)
}


function parseInterpolation(context: any) {
  // source: '{{message}}'


  // 解析 {{message}}

  // 1. 找 }} 的位置
  const closeIndex = context.source.indexOf('}}')  // 9

  // 2. 删除 {{ 
  context.source = context.source.slice(2)

  // 3.  通过 closeIndex  计算 message 的范围 
  const rawContextLength = closeIndex - 2

  // 4. 获取 message
  const RawContent = context.source.slice(0, rawContextLength)

  // 优化, 去除 {{ message }} 两边的空格
  const content = RawContent.trim()

  // 5. 删除 }} 
  context.source = context.source.slice(rawContextLength + 2)

  // 此时 context.source 为 ''


  // 先构造一个节点
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content
    }
  }
}
