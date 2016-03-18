StackOverflow = StackOverflow or {}

# http://stackoverflow.com/a/31349123/642778
# did some cleanup and customization of the fonts
StackOverflow.drawBezier = (options = {}, ctx) ->
  bezier = (b1, b2) ->
    #Final stage which takes p, p+1 and calculates the rotation, distance on the path and accumulates the total distance
    @rad = Math.atan(b1.point.mY / b1.point.mX)
    @b2 = b2
    @b1 = b1
    dx = b2.x - (b1.x)
    dx2 = (b2.x - (b1.x)) * (b2.x - (b1.x))
    @dist = Math.sqrt((b2.x - (b1.x)) * (b2.x - (b1.x)) + (b2.y - (b1.y)) * (b2.y - (b1.y)))
    xDist = xDist + @dist
    @curve =
      rad: @rad
      dist: @dist
      cDist: xDist
    return

  bezierT = (t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY) ->
    #calculates the tangent line to a point in the curve; later used to calculate the degrees of rotation at this point.
    @mx = 3 * (1 - t) * (1 - t) * (control1X - startX) + 6 * (1 - t) * t * (control2X - control1X) + 3 * t * t * (endX - control2X)
    @my = 3 * (1 - t) * (1 - t) * (control1Y - startY) + 6 * (1 - t) * t * (control2Y - control1Y) + 3 * t * t * (endY - control2Y)
    return

  bezier2 = (t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY) ->
    #Quadratic bezier curve plotter
    @Bezier1 = new bezier1(t, startX, startY, control1X, control1Y, control2X, control2Y)
    @Bezier2 = new bezier1(t, control1X, control1Y, control2X, control2Y, endX, endY)
    @x = (1 - t) * @Bezier1.x + t * @Bezier2.x
    @y = (1 - t) * @Bezier1.y + t * @Bezier2.y
    @slope = new bezierT(t, startX, startY, control1X, control1Y, control2X, control2Y, endX, endY)
    @point =
      t: t
      x: @x
      y: @y
      mX: @slope.mx
      mY: @slope.my
    return

  bezier1 = (t, startX, startY, control1X, control1Y, control2X, control2Y) ->
    #linear bezier curve plotter; used recursivly in the quadratic bezier curve calculation
    @x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * control1X + t * t * control2X
    @y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * control1Y + t * t * control2Y
    return

  if options.curve?
    options.points ?= options.curve.split(',')

  options.text ?= 'Text'
  options.letterPadding ?= 1 / 4
  options.fillStyle ?= 'white'
  options.fillLineWidth ?= 1
  options.strokeLineWidth ?= 10
  options.strokeStyle ?= undefined # lol
  options.font ?= '40px Helvetica'
  options.points ?= []
  options.drawText ?= true
  options.drawCurve ?= false
  options.maxChar ?= 50
  options.x ?= 0
  options.y ?= 0

  throw 'needs 8 points' if options.points.length != 8

  options.points = options.points.map (item) -> parseFloat(item)

  i = 0
  for point in options.points
    if i % 2 == 0
      options.points[i] += options.x
    else
      options.points[i] += options.y
    i += 1


  ribbonSpecs =
    maxChar: options.maxChar
    startX: options.points[0]
    startY: options.points[1]
    control1X: options.points[2]
    control1Y: options.points[3]
    control2X: options.points[4]
    control2Y: options.points[5]
    endX: options.points[6]
    endY: options.points[7]
  # ctx.clearRect 0, 0, canvas.width, canvas.height

  if options.drawCurve
    ctx.save()
    ctx.beginPath()
    ctx.moveTo ribbonSpecs.startX, ribbonSpecs.startY
    ctx.bezierCurveTo ribbonSpecs.control1X, ribbonSpecs.control1Y, ribbonSpecs.control2X, ribbonSpecs.control2Y, ribbonSpecs.endX, ribbonSpecs.endY
    ctx.stroke()
    ctx.restore()

  return unless options.drawText

  textCurve = []
  ribbon = options.text.substring(0, ribbonSpecs.maxChar)
  curveSample = 1000
  xDist = 0
  i = 0
  i = 0
  while i < curveSample
    a = new bezier2(i / curveSample, ribbonSpecs.startX, ribbonSpecs.startY, ribbonSpecs.control1X, ribbonSpecs.control1Y, ribbonSpecs.control2X, ribbonSpecs.control2Y, ribbonSpecs.endX, ribbonSpecs.endY)
    b = new bezier2((i + 1) / curveSample, ribbonSpecs.startX, ribbonSpecs.startY, ribbonSpecs.control1X, ribbonSpecs.control1Y, ribbonSpecs.control2X, ribbonSpecs.control2Y, ribbonSpecs.endX, ribbonSpecs.endY)
    c = new bezier(a, b)
    textCurve.push
      bezier: a
      curve: c.curve
    i++
  letterPadding = ctx.measureText(' ').width * options.letterPadding
  w = ribbon.length
  ww = Math.round(ctx.measureText(ribbon).width)
  totalPadding = (w - 1) * letterPadding
  totalLength = ww + totalPadding
  p = 0
  cDist = textCurve[curveSample - 1].curve.cDist
  z = cDist / 2 - (totalLength / 2)
  i = 0
  while i < curveSample
    if textCurve[i].curve.cDist >= z
      p = i
      break
    i++
  i = 0
  while i < w
    ctx.save()
    ctx.translate textCurve[p].bezier.point.x, textCurve[p].bezier.point.y
    ctx.rotate textCurve[p].curve.rad

    ctx.font = options.font
    if options.strokeStyle?
      ctx.strokeStyle = options.strokeStyle
      ctx.lineWidth = options.strokeLineWidth
      ctx.strokeText ribbon[i], 0, 0
    ctx.fillStyle = options.fillStyle
    ctx.lineWidth = options.fillLineWidth
    ctx.fillText ribbon[i], 0, 0

    ctx.restore()
    x1 = ctx.measureText(ribbon[i]).width + letterPadding
    x2 = 0
    j = p
    while j < curveSample
      x2 = x2 + textCurve[j].curve.dist
      if x2 >= x1
        p = j
        break
      j++
    i++
  return
