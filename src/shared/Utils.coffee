# Shared methods between all engines
class Utils
  @JSON_URLS = ['.json']
  @IMG_URLS = ['.png', '.jpg', '.jpeg']
  @SAVE_URLS = ['.save.json']
  @AUDIO_URLS = ['.mp3', '.ogg', '.wav']

  @CAMERA_DEFAULT_VIEW_ANGLE = 45
  @CAMERA_DEFAULT_NEAR = 1
  @CAMERA_DEFAULT_FAR = 100000
  @CAMERA_DEFAULT_TYPE = 'PerspectiveCamera'

  @SKY_SPHERE_DEFAULT_RADIUS = 50000
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

  @POINT_LIGHT_DEFAULT_COLOR = '#ffffff'
  @POINT_LIGHT_DEFAULT_INTENSITY = 1
  @POINT_LIGHT_DEFAULT_DISTANCE = 100
  @POINT_LIGHT_DEFAULT_DECAY = 1

  @MIRROR_DEFAULT_COLOR = '#777777'
  @MIRROR_DEFAULT_TEXTURE_WIDTH = 512
  @MIRROR_DEFAULT_TEXTURE_HEIGHT = 512
  @MIRROR_DEFAULT_CLIP_BIAS = 0.003

  @WATER_DEFAULT_WATER_COLOR = '#001e0f'
  @WATER_DEFAULT_ALPHA = 1.0

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

  # Add a custom button at a given position.
  #
  # By default, it adds the fullscreen button. Valid types are:
  #
  # * fullscreen - toggles fullscreen
  # * reinit - reinits the current scene
  #
  # @param [Hash] options
  #
  # @example
  #   Util.addCEButton(size: '32px', padding: '32px', position: 'bottom-right')
  @addCEButton: (options = {})->
    options.size ?= '32px'
    options.padding ?= '32px'
    options.position ?= 'bottom-right'
    options.type ?= 'fullscreen'

    throw new Error("invalid type #{options.type}") unless ['fullscreen', 'reinit'].includes(options.type)

    throw new Error("invalid position #{options.position}") unless ['top-right', 'bottom-right', 'top-left', 'bottom-left'].includes(options.position)
    posArray = options.position.split('-')

    img = document.createElement('img')
    img.style = "position: absolute; width: #{options.size}; height: #{options.size};" + "#{posArray[0]}: #{options.padding}; #{posArray[1]}: #{options.padding}"
    if options.type == 'fullscreen'
      img.setAttribute 'onclick', 'Utils.toggleFullScreen()'
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4AYMDR07WbntUQAAAMZJREFUWMPtl7ENgzAQRR+IkhFYIdUVUTKP9wjswSCZIBHFVVmBEVKbNBTIMsFBcpLiXnlC9ke+7/suRGQinU5V23cfiEgLXFIXLPkxJqCK1J7AY0XcmLDmCAyRugcOQL0sFpEmvKvqOcffisgNOG0dQfnNI7cmNAEV0O2w2l564IphGEYwjsOMN6pqn2kcO6AJb8IwQA7zjZUDBxxtGJmALQE+434+ZsPpg1jeb1l0tppLjeWxd0EdRucFKWGiCa1mTfjXAl7JzisvsBIkfgAAAABJRU5ErkJggg=='
    else if options.type == 'reinit'
      img.setAttribute 'onclick', 'engine.initScene(SceneManager.get().currentScene())'
      img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfgBgwNMCmKKsb2AAACbklEQVRIx5XVz2tcVRQH8M971dZ01GppNWbhSHFjdJXTookiCOpGChKKVv8E68Yfiy6sol0J1l3ddCmIOxfBleBCyISqZ1BoxIUUuxCNJdVYiaEQdDF3zEzn1XG+m8u795zvvfec+77fSkHI3njEvCMeczQvGEI/YhiVnbR5C+7tL2Q1GhxP5WfX09wU73peeyT2e034MLY858tBktrbWv4eCV1pJLim7Xy8l2KAYFPb+ghFZ66JoAavxec7FHWyqe3X60/QbSJ4v4xPxHKfol/EM14djGwqIcQhF0yBM/l6IQjC18MlzAduQMBt1grFI86nmmSprP9UatFcQiRXzZaPjxN1iGfdA067v5SzuYSFIn90EtwXx0JFfOUwtnIq2OuSAx7KVf+J+FMLK7lQR8th8BalI5vj0nEazMettWfK1Llyx83tO43HuTI+WXsYXM7f+nf85tr4/Lzid/B4Xf6Db02KXuNnanfAyEscj3VwoC5vsZqYYBvsql0FBycmuAts1H4AcxMT9DIu1kUb9kd7kuxo299rR+3TMvfCRPv3o5cqIs3hr9w7wQk2TaGbsSvYcAw3z2z//MX/TH/D0+CVmdUK4hd3gwd9l+OSmdX7V9Zymppgsax2tWJcektf7RajJ5MpO86C3db/lYtmzFq3G3yQnezrbMiXLaOyx2qcuuH+p6zao0InTwyLqhTLFkrklnd8lJeG+v6iN93SF/18tG8u1aDzxVkvDWx4RddlHDRXno1y+BM73lQNm2fM+6R0pBlrFrMzbG2DistKTjuu0VV0Hc9pHUP22uTBUtzuqHDIPmy4KC3lH00G/w/Uq7TDOW+poQAAAABJRU5ErkJggg=='
    if options.src?
      img.src = options.src

    document.body.appendChild img

  # Basic way to find out if we are on a mobile device
  @isMobile = ->
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  # Allow only one screen orientation
  #
  # Valid orientation types:
  #
  # * all
  # * landscape
  # * portrait
  #
  # @example Utils.orientation('landscape')
  #
  @orientation = (orientation = 'all')->
    existingElement = document.querySelector('.ce-turn-screen')
    document.body.removeChild(existingElement) if existingElement?
    existingStyle = document.querySelector('.ce-turn-screen-style')
    document.head.removeChild(existingStyle) if existingStyle?
    return if orientation == 'all'

    throw new Error("invalid orientation type '#{orientation}'") unless ['all', 'landscape', 'portrait'].includes(orientation)

    div = document.createElement('div')
    div.setAttribute 'class', 'ce-turn-screen'
    div.style = 'position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; background-color: #f0f0f0;'

    img = document.createElement('img')
    img.src = 'data:image/png;base64,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'
    baseStyle = 'position: absolute; margin: auto; top: 0; left: 0; right: 0; bottom: 0;'
    if orientation == 'landscape'
      img.style = "#{baseStyle}transform: rotate(90deg);"
      a1 = 'canvas#coffee-engine-dom'
      a2 = '.ce-turn-screen'
    else
      img.style = baseStyle
      a1 = '.ce-turn-screen'
      a2 = 'canvas#coffee-engine-dom'

    style = document.createElement('style')
    style.setAttribute 'class', 'ce-turn-screen-style'
    style.setAttribute 'type', 'text/css'
    style.setAttribute 'media', 'all'
    style.innerHTML = "
@media all and (orientation:portrait) {
    #{a1} {
      display: none;
    }
}
@media all and (orientation:landscape) {
    #{a2} {
      display: none;
    }
}"
    document.head.appendChild style
    div.appendChild img
    document.body.appendChild div

exports.Utils = Utils
