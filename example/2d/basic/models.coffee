points = [
  new Point(0, 0)
  new Point(128, 0)
  new Point(128, 30)
  new Point(0, 30)
]

turretSize = [
  new Point(0, 0)
  new Point(10, 0)
  new Point(10, 10)
  new Point(0, 10)
]

class LevelLoader
  constructor: () ->
    @current = 0
    @levels = []

  currentLevel: () ->
    return @levels[@current]

  setLevel: (i) ->
    @current = i

  nextLevel: () ->
    @current++

class Level
  constructor: (json) ->

class Sprite extends Polygon
  constructor: (points) ->
    super(points)
    @skin = document.getElementById('player')
    @time = 0
    @currentFrame = 0
    @totalFrames = 2
    @fps = 0.4

  getAnimationFrame: (tpf) ->
    @time += tpf
    if @fps <= @time
      @time = 0
      @currentFrame++
    if @currentFrame >= @totalFrames
      @currentFrame = 0

    @skin

class Player extends Sprite
  constructor: ->
    super(points)
    @color = 'blue'
    @speed = 100
    @defaultDirection = new Point(0, 0)
    @direction = @defaultDirection.clone()
    @isAttracted = false
    @skin = document.getElementById('player')

  move: (tpf) ->
    if !@isAttracted
      @direction = @defaultDirection.clone()

    @position.x += @direction.x * @speed * tpf
    @position.y += @direction.y * @speed * tpf

  applyDirectionModifierFrom: (tower) ->
    @direction = tower.directionModifier

  draw: (context, tpf) ->
    @getAnimationFrame(tpf)
    offsetX = 0
    offsetY = 0
    if @currentFrame == 1
      offsetX = 128
      offsetY = 30

    context.drawImage(
       @skin, 0 + offsetX, 0, 128 + @currentFrame, 30,
       @getPolygonCenter().x - 128 / 2, @getPolygonCenter().y - 15 / 2,
       128, 30)

class Tower extends Sprite

class GravityWell extends Tower
  constructor: (position)->
    super(turretSize)
    @color = 'red'
    @attractDistance = 130
    @directionModifier = new Point(0, 1)
    @position = position

  setDirectionModifier: (directionModifier) ->
    @directionModifier = directionModifier
    return this

  attracts: (polygon) ->
    return @getPolygonCenter().distanceTo(polygon.getPolygonCenter()) < @attractDistance

named_classes = { GravityWell: GravityWell }
