import * as parser from 'luaparse'
import * as fs from 'fs'
import pretty from './pretty.js'

var contents = fs.readFileSync('main.lua', {encoding: 'utf8'})
var ast = parser.parse(contents, {encodingMode: 'pseudo-latin1'})


fs.writeFileSync('out.lua', pretty(ast))
console.log('wrote to out.lua')
