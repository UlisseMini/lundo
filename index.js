import './styles.css'
import * as parser from 'luaparse'
import pretty from './pretty.js'

const textarea = document.querySelector('textarea')
const button = document.querySelector('button')

textarea.addEventListener('keydown', (e) => {
  console.log(e.keyCode)
  if (e.keyCode == 13 && e.shiftKey) {
    button.click()
    e.preventDefault()
  } else if (e.keyCode == 9) {
    textarea.value = `${textarea.value.substring(0, textarea.selectionStart)}  ${textarea.value.substring(textarea.selectionEnd)}`
    textarea.selectionEnd = textarea.selectionStart + 2
    textarea.selectionStart = textarea.selectionEnd
    e.preventDefault()
  }
})

button.addEventListener('click', (e) => {
  e.preventDefault()
  const luaCode = textarea.value
  const ast = parser.parse(luaCode, {encodingMode: 'pseudo-latin1'})
  const prettyLuaCode = pretty(ast)
  textarea.value = prettyLuaCode
})
