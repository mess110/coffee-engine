engine = undefined

canvas_width = 800
canvas_height = 480

canvas = document.getElementById('game')

doKeyDown = (event) ->
  console.log event

doMouseDown = (event) ->
  console.log event

tick = (tpf) ->
  engine.clear()
  engine.drawText(Math.round(1 / tpf) + 'fps')

window.onload = ->
  engine = new Engine('game', canvas_width, canvas_height, tick,
    doMouseDown, doKeyDown)
  engine.start()
