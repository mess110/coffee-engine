class EngineUtils
  # https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Using_full_screen_mode
  @toggleFullScreen: ->
    if not document.fullscreenElement and not document.mozFullScreenElement and not document.webkitFullscreenElement and not document.msFullscreenElement # current working methods
      if document.documentElement.requestFullscreen
        document.documentElement.requestFullscreen()
      else if document.documentElement.msRequestFullscreen
        document.documentElement.msRequestFullscreen()
      else if document.documentElement.mozRequestFullScreen
        document.documentElement.mozRequestFullScreen()
      else document.documentElement.webkitRequestFullscreen Element.ALLOW_KEYBOARD_INPUT  if document.documentElement.webkitRequestFullscreen
    else
      if document.exitFullscreen
        document.exitFullscreen()
      else if document.msExitFullscreen
        document.msExitFullscreen()
      else if document.mozCancelFullScreen
        document.mozCancelFullScreen()
      else document.webkitExitFullscreen()  if document.webkitExitFullscreen
    return
