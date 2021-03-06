const INDENT = '  '
var depth = 0 // TODO: Don't use global variables

const dispatch = {}

function pretty(ast) {
  if (ast == null) throw new Error('ast is null')

  var handler = dispatch[ast.type]
  if (typeof handler != 'function') {
    console.log(ast)
    throw new Error(`ast type ${ast.type} not handled`)
  } else {
    return handler(ast)
  }
}

// TODO: Overload pretty by checking if ast is an array?
function prettyBody(body) {
  const s = '\n' + INDENT.repeat(++depth)
  return s + body.map(pretty).join(s) + '\n' + INDENT.repeat(--depth)
}

dispatch.Chunk = (chunk) => chunk.body.map(pretty).join('\n')
dispatch.BinaryExpression = (expr) => `(${pretty(expr.left)} ${expr.operator} ${pretty(expr.right)})`
dispatch.Identifier = (ident) => ident.name
dispatch.NumericLiteral = (lit) => lit.raw
dispatch.NilLiteral = (lit) => lit.raw
dispatch.BooleanLiteral = (lit) => lit.raw
dispatch.BreakStatement = (b) => 'break'
dispatch.StringLiteral = (lit) => {
  if (lit.value == null)
    throw new Error(`string literal value is null, did you set encodingMode on luaparse?`)
  return JSON.stringify(lit.value)
}
dispatch.AssignmentStatement = (assign) => {
  var lhs = assign.variables.map(pretty).join(', ')
  var rhs = assign.init.map(pretty).join(', ')
  return lhs + ' = ' + rhs
}
dispatch.LocalStatement = (stmt) => {
  var lhs = stmt.variables.map(pretty).join(', ')
  // the difference between local and assign is in local variables assignment is optional
  var rhs = stmt.init.length > 0 ? ' = ' + stmt.init.map(pretty).join(', ') : ''
  return 'local ' + lhs + rhs
}
dispatch.FunctionDeclaration = (fn) => {
  var params = fn.parameters.map(pretty).join(', ')
  var body = prettyBody(fn.body)
  var prefix = 'function'
  if (fn.identifier != null) {prefix += ' ' + fn.identifier.name}
  return `${prefix}(${params})${body}end`
}
dispatch.ReturnStatement = (ret) => 'return ' + ret.arguments.map(pretty).join(', ')
dispatch.CallStatement = (stmt) => {
  // NOTE: This might fail with function exprs of the wrong precedence
  return pretty(stmt.expression)
}
dispatch.CallExpression = (expr) => {
  return pretty(expr.base) + '(' + expr.arguments.map(pretty).join(', ') + ')'
}
dispatch.StringCallExpression = (expr) => {
  return pretty(expr.base) + ' ' + pretty(expr.argument)
}
dispatch.ForNumericStatement = (f) => {
  var step = f.step ? ',' + pretty(f.step) : ''
  var main = pretty(f.variable) + '=' + [f.start, f.end].map(pretty).join(',') + step
  var body = prettyBody(f.body)
  return `for ${main} do${body}end`
}
dispatch.ForGenericStatement = (f) => {
  var main = f.variables.map(pretty).join(',') + ' in ' + f.iterators.map(pretty).join(',')
  var body = prettyBody(f.body)
  return `for ${main} do${body}end`
}
dispatch.TableCallExpression = (expr) => {
  return pretty(expr.base) + ' ' + pretty(expr.arguments)
}
dispatch.TableConstructorExpression = (t) => {
  // TODO: Split on multiple lines for big tables
  return '{' + t.fields.map(v => pretty(v)).join(', ') + '}'
}
dispatch.TableValue = (tv) => pretty(tv.value)
dispatch.TableKeyString = (tk) => pretty(tk.key) + ' = ' + pretty(tk.value)
dispatch.TableKey = (tk) => `[${pretty(tk.key)}] = ${pretty(tk.value)}`
dispatch.MemberExpression = (exp) => pretty(exp.base) + exp.indexer + pretty(exp.identifier)
dispatch.IndexExpression = (exp) => pretty(exp.base) + '[' + pretty(exp.index) + ']'
dispatch.WhileStatement = (stmt) => {
  var cond = pretty(stmt.condition)
  var body = prettyBody(stmt.body)

  return `while ${cond} do${body}end`
}
dispatch.RepeatStatement = (stmt) => {
  var cond = pretty(stmt.condition)
  var body = prettyBody(stmt.body)
  return `repeat${body}until ${cond}`
}
dispatch.LogicalExpression = (exp) =>
  `(${pretty(exp.left)} ${exp.operator} ${pretty(exp.right)})`
dispatch.UnaryExpression = (exp) => `${exp.operator} ${pretty(exp.argument)}`
dispatch.IfStatement = (stmt) => {
  return stmt.clauses.map(pretty).join('') + 'end'
}
dispatch.IfClause = (c) => `if ${pretty(c.condition)} then${prettyBody(c.body)}`
dispatch.ElseifClause = (c) => `elseif ${pretty(c.condition)} then${prettyBody(c.body)}`
dispatch.ElseClause = (c) => `else${prettyBody(c.body)}`

export default pretty
