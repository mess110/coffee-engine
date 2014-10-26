class Point
  constructor: (x, y) ->
    @x = x
    @y = y

  isInside: (polygon) ->
    poly = []
    i = 0
    l = polygon.points.length

    while i < l
      v = polygon.points[i]
      poly.push new Point(v.x + polygon.position.x, v.y + polygon.position.y)
      i++
    c = false
    i = -1
    l = poly.length
    j = l - 1

    while ++i < l
      ((poly[i].y <= @y and @y < poly[j].y) or (poly[j].y <= @y and @y < poly[i].y)) and (@x < (poly[j].x - poly[i].x) * (@y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) and (c = not c)
      j = i
    return c

  distanceTo: (point) ->
    xs = @x - point.x
    ys = @y - point.y
    Math.sqrt xs * xs + ys * ys

  clone: () ->
    new Point(@x, @y)
