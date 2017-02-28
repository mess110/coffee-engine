# Used as a dummy renderer if WebGL is not supported.
#
# Override the makeDomElement method to change the HTML of the object show on screen.
# The object has the id coffee-engine-dom so you can modify it from CSS.
class PolyfillRenderer
  constructor: ->
    @domElement = PolyfillRenderer.makeDomElement()

  getPixelRatio: ->
    1

  setSize: (width, height) ->

  render: (scene, camera) ->

  @makeDomElement: ->
    element = document.createElement('div')
    element.innerHTML = 'WebGL not supported'
    element.style.display = 'flex'
    element.style.position = 'absolute'
    element.style.width = '100%'
    element.style.height = '100%'
    element.style['align-items'] = 'center'
    element.style['text-align'] = 'center'
    element.style['background-color'] = 'black'
    element.style['color'] = 'white'
    element.style['z-index'] = Utils.CE_UI_Z_INDEX * 10
    element
