const parser = require('luaparse')
const fs = require('fs')
const pretty = require('./pretty.js')

var contents = fs.readFileSync('obtest.lua', {encoding: 'utf8'})
var ast = parser.parse(contents, {encodingMode: 'pseudo-latin1'})


fs.writeFileSync('out.lua', pretty(ast))
console.log('done')
