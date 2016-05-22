# Shared methods between all engines
class Utils
  @JSON_URLS = ['.json']
  @IMG_URLS = ['.png', '.jpg', '.jpeg']
  @SAVE_URLS = ['.save.json']
  @AUDIO_URLS = ['.mp3', '.ogg', '.wav']

  @CAMERA_DEFAULT_VIEW_ANGLE = 45
  @CAMERA_DEFAULT_NEAR = 1
  @CAMERA_DEFAULT_FAR = 10000
  @CAMERA_DEFAULT_TYPE = 'PerspectiveCamera'

  @SKY_SPHERE_DEFAULT_RADIUS = 450000
  @SKY_SPHERE_DEFAULT_SEGMENTS = 64

  @PLANE_DEFAULT_COLOR = '#ff0000'
  @PLANE_DEFAULT_WIDTH = 5
  @PLANE_DEFAULT_HEIGHT = 5
  @PLANE_DEFAULT_W_SEGMENTS = 1
  @PLANE_DEFAULT_H_SEGMENTS = 1

  @AMBIENT_LIGHT_DEFAULT_COLOR = '#404040'

  @LIGHT_DEFAULT_COLOR = '#ffffff'
  @LIGHT_DEFAULT_POSITION_X = 0
  @LIGHT_DEFAULT_POSITION_Y = 100
  @LIGHT_DEFAULT_POSITION_Z = 60

  # Requires a user action like pressing a button. Does not work if placed in
  # document ready or something similar.
  #
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

  # Generate a random GUID
  #
  # https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  @guid: ->
    s4 = ->
      Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
    s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()

  # Sets the cursor
  #
  # param [String] url of the new cursor
  @setCursor: (url) ->
    document.body.style.cursor = "url('#{url}'), auto"

  # Convert RGB value to Hex
  @rgbToHex = (r, g, b) ->
    throw "Invalid color component"  if r > 255 or g > 255 or b > 255
    ((r << 16) | (g << 8) | b).toString 16

  # Returns key name used in texture manager or json model manager
  #
  # @example
  #   LoadingScene.getKeyName('/demo/foo.json', Utils.JSON_URLS) # returns 'foo'
  @getKeyName = (url, array) ->
    url.replaceAny(array, '').split('/').last()

  # Save a file
  #
  # @see https://github.com/carlos-algms/FileSaver.js
  @saveFile = (content, fileName, format="application/json") ->
    try
      isFileSaverSupported = ! !new Blob
    catch e
      throw 'FileSaver not supported'

    json = JSON.stringify(content, null, 2)
    blob = new Blob([json], type: "#{format};charset=utf-8")
    saveAs blob, fileName

exports.Utils = Utils
