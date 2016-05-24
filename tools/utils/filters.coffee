app.filter 'keyboardShortcut', ($window) ->
  (str) ->
    if !str
      return
    keys = str.split('-')
    isOSX = /Mac OS X/.test($window.navigator.userAgent)
    seperator = if !isOSX or keys.length > 2 then '+' else ''
    abbreviations = 
      M: if isOSX then '⌘' else 'Ctrl'
      A: if isOSX then 'Option' else 'Alt'
      S: 'Shift'
    keys.map((key, index) ->
      last = index == keys.length - 1
      if last then key else abbreviations[key]
    ).join seperator
