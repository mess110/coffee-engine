class Polygon
  constructor: (points) ->
    @points = points
    @position = new Point(0, 0);
    @color = "green"

  draw: (context) ->
    oldWidth = context.lineWidth

    context.beginPath()
    context.lineWidth = "5"
    context.strokeStyle = @color
    context.fillStyle = @color
    i = 0
    l = @points.length
    worldPoints = @getWorldPoints()

    while i < l
      v = worldPoints[i]
      context.moveTo v.x, v.y if i is 0
      context.lineTo v.x, v.y
      context.stroke()
      context.fill()
      i++
    context.lineWidth = oldWidth
    return

  # TODO dry this up
  intersects: (other) ->
    intersectionFound = false
    for point in @getWorldPoints()
      if point.isInside(other)
        intersectionFound = true
        break
    if !intersectionFound
      for point in other.getWorldPoints()
        if point.isInside(this)
          intersectionFound = true
          break
    return intersectionFound

  getWorldPoints: () ->
    worldPoints = []
    for point in @points
      worldPoints.push new Point(point.x + @position.x, point.y + @position.y)
    return worldPoints

  getPolygonCenter: () ->
    twicearea = 0
    x = 0
    y = 0
    nPts = @points.length
    p1 = undefined
    p2 = undefined
    f = undefined
    i = 0
    j = nPts - 1

    while i < nPts
      p1 = @points[i]
      p2 = @points[j]
      f = p1.x * p2.y - p2.x * p1.y
      twicearea += f
      x += (p1.x + p2.x) * f
      y += (p1.y + p2.y) * f
      j = i++
    f = twicearea * 3
    new Point(x / f + @position.x, y / f + @position.y)
