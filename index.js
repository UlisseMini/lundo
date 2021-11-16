const parser = require('luaparse')
const fs = require('fs')
const pretty = require('./pretty.js').pretty


var contents = fs.readFileSync('obtest.lua', {encoding: 'utf8'})
var ast = parser.parse(contents, {encodingMode: 'pseudo-latin1'})


console.log(ast)
console.log('------------- Pretty -------------')
console.log(pretty(ast))
