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

exports.Utils = Utils
