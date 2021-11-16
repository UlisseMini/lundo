import './styles.css'
import * as parser from 'luaparse'
import pretty from './pretty.js'

const textarea = document.querySelector('textarea')
const button = document.querySelector('button')
const msg = document.getElementById('msg')

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
  try {
    const ast = parser.parse(luaCode, {encodingMode: 'pseudo-latin1'})
  } catch (e) {
    msg.textContent = e.message
    msg.style.visibility = ''
    msg.style.color = 'red'
    return
  }
  msg.textContent = 'Format successful'
  msg.style.visibility = ''
  msg.style.color = 'green'

  const prettyLuaCode = pretty(ast)
  textarea.value = prettyLuaCode
})
