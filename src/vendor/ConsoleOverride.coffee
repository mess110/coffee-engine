_log = console.log
_warn = console.warn
_info = console.info
_error = console.error

_ceOutput = 'coffee-engine console >'

console.log = (message) ->
  _ceOutput += "\n#{message}"
  html = document.querySelector('.ce-console-text')
  if html?
    html.innerHTML = _ceOutput
    html.scrollTop = html.scrollHeight
  _log.apply console, arguments
  return

console.info = (message) ->
  _ceOutput += "\n#{message}"
  html = document.querySelector('.ce-console-text')
  if html?
    html.innerHTML = _ceOutput
    html.scrollTop = html.scrollHeight
  _info.apply console, arguments
  return

console.warn = (message) ->
  _ceOutput += "\n#{message}"
  html = document.querySelector('.ce-console-text')
  if html?
    html.innerHTML = _ceOutput
    html.scrollTop = html.scrollHeight
  _warn.apply console, arguments
  return

console.error = (message) ->
  _ceOutput += "\n#{message}"
  html = document.querySelector('.ce-console-text')
  if html?
    html.innerHTML = _ceOutput
    html.scrollTop = html.scrollHeight
  _error.apply console, arguments
  return
