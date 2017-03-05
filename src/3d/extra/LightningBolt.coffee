# Base class for LightningBolt
class Bolt extends BaseModel
  constructor: (src, dest, thickness=1, color=0x0000ff, density=1, circumference=1) ->
    super()

    @src = src
    @dest = dest
    @color = color
    @thickness = thickness
    @density = density
    @circumference = circumference

    material = new (THREE.LineBasicMaterial)(transparent: true, color: @color, linewidth: @thickness)
    geometry = new (THREE.Geometry)
    @mesh = new (THREE.Line)(geometry, material)

    results = LightningBolt.createBolt(@src, @dest, @thickness, @density, @circumference)
    @setSegments(results)

  strike: (src, dest) ->
    src ?= @src
    dest ?= @dest
    @src = src
    @dest = dest
    @setSegments(LightningBolt.createBolt(src, dest, @thickness, @density, @circumference))

  setSegments: (lines) ->
    geometry = new THREE.Geometry()

    vertices = []
    for line in lines
      if vertices.indexOf(line.src) == -1
        vertices.push line.src
      if vertices.indexOf(line.dest) == -1
        vertices.push line.dest

    geometry.vertices = vertices
    geometry.verticesNeedUpdate = true
    @mesh.geometry = geometry

  getPointOnBolt: (percentage) ->
    pointIndex = percentage * ( @mesh.geometry.vertices.size() - 1 )
    rounded = Math.round(pointIndex)
    if parseInt(pointIndex) == rounded
      rounded = 1 if rounded == 0
      src = @mesh.geometry.vertices[rounded - 1]
      dest = @mesh.geometry.vertices[rounded]
    else
      rounded = @mesh.geometry.vertices.size() - 2 if rounded == @mesh.geometry.vertices.size() - 1
      src = @mesh.geometry.vertices[rounded]
      dest = @mesh.geometry.vertices[rounded + 1]
    @getPointInBetweenByPerc(src, dest, 0.5)

  getPointInBetweenByPerc: (pointA, pointB, percentage) ->
    dir = pointB.clone().sub(pointA)
    len = dir.length()
    dir = dir.normalize().multiplyScalar(len * percentage)
    pointA.clone().add dir

  @createBolt: (src, dest, thickness, density, circumference) ->
    results = []

    tangent = dest.clone().sub(src.clone())
    normal = new THREE.Vector3(tangent.y, -tangent.x, tangent.z).normalize()
    length = Helper.distanceTo(src, dest)

    positions = [0]
    for i in [0...((length / 4)) * density]
      positions.push Math.random()
    positions = positions.sort()

    sway = 80
    jaggedness = 1 / sway / circumference

    prevPoint = src.clone()
    prevDisplacement = 0
    prevDisplacementZ = 0

    i = 0
    for pos in positions
      if i == 0
        i += 1
        continue
      scale = (length * jaggedness) * (pos - positions[i - 1])
      envelope = if pos > .95 then 20 * (1 - pos) else 1

      displacement = Helper.random(-sway, sway) + Math.random()
      displacement -= (displacement - prevDisplacement) * (1 - scale)
      displacement *= envelope

      displacementZ = Helper.random(-sway, sway) + Math.random()
      displacementZ -= (displacementZ - prevDisplacementZ) * (1 - scale)
      displacementZ *= envelope

      x = src.x + pos * tangent.x + displacement * normal.x
      y = src.y + pos * tangent.y + displacement * normal.y
      z = src.z + pos * tangent.z + displacement * normal.z
      z = displacementZ
      point = new THREE.Vector3(x, y, z)

      results.push
        src: prevPoint
        dest: point

      prevPoint = point
      prevDisplacement = displacement
      prevDisplacementZ = displacementZ

      i += 1

    results.push
      src: prevPoint
      dest: dest

    results

class LightningBolt extends Bolt
  constructor: (src, dest, thickness=1, color=0x0000ff, density=1, circumference) ->
    super(src, dest, thickness, color, density, circumference)

    @opacity = 0
    @bolts = []
    @numBranches = 0

  addBranch: (thickness, color, density, circumference)->
    @numBranches += 1
    newBolt = new LightningBolt(new THREE.Vector3(), new THREE.Vector3(), thickness, color, density, circumference)
    @bolts.push newBolt
    @mesh.add newBolt.mesh
    newBolt

  _getBranchPoints: ->
    branchPoints = []
    for i in [0...@numBranches]
      branchPoints.push Math.random()
    branchPoints.sort()

  _getTargetBranchPoint: (bolt) ->
    branchPoints = @_getBranchPoints()
    branchPoints[@bolts.indexOf(bolt)]

  getChildBoltStart: (bolt) ->
    targetBranchPoint = @_getTargetBranchPoint(bolt)
    @getPointOnBolt(targetBranchPoint)

  getChildBoltEnd: (bolt) ->
    targetBranchPoint = @_getTargetBranchPoint(bolt)
    boltSrc = @getChildBoltStart(bolt)

    diff = new THREE.Vector3(@dest.x - @src.x, @dest.y - @src.y, @dest.z - @src.z)
    # diff = new THREE.Vector3(bolt.dest.x - bolt.src.x, bolt.dest.y - bolt.src.y, bolt.dest.z - bolt.src.z)
    x = diff.x * (1 - targetBranchPoint) + boltSrc.x
    y = diff.y * (1 - targetBranchPoint) + boltSrc.y
    z = diff.z * (1 - targetBranchPoint) + boltSrc.z
    new THREE.Vector3(x, y, z)

  strike: (src, dest) ->
    super(src, dest)
    for bolt in @bolts
      boltSrc = @getChildBoltStart(bolt)
      boltEnd = @getChildBoltEnd(bolt)
      bolt.strike(boltSrc, boltEnd)

# Class which simulates lightning
#
# @param src - start point
# @param dest - dest point
# @param thickness - how thick the bolt is
# @param color - the color of the bolt
# @param density - how many changes of direction in one bolt
# @param circumference - how much the bolt spreads
# @param addBranches - callback instead of overrding addBranches
#
# @example
#   line = new BranchLightning(
#     new (THREE.Vector3)(0, 10, 0),
#     new (THREE.Vector3)(0, 0, 0),
#     3, 'white', 50, 1, (parentBolt) ->
#       for i in [0...1]
#         newBolt = parentBolt.addBranch(parentBolt.thickness / 2, 'yellow', parentBolt.density / 2, parentBolt.circumference)
#         for j in [0...1]
#           newBolt.addBranch(newBolt.thickness / 3, 'orange', newBolt.density / 3, newBolt.circumference)
#   )
#
# @example
#   class MyBolt extends BranchLightning
#     addBranches: ->
#       for i in [0...1]
#         newBolt = addBranch(@thickness / 2, 'yellow', @density / 2, @circumference)
#         for j in [0...1]
#           newBolt.addBranch(@thickness / 3, 'orange', @density / 3, @circumference)
#
#   line = new MyBolt(
#     new (THREE.Vector3)(0, 10, 0),
#     new (THREE.Vector3)(0, 0, 0),
#     3, 'white', 10, 1
#   )
#
# @example
#   LightningBolt::getChildBoltEnd = (bolt) ->
#     @dest
class BranchLightning extends LightningBolt
  constructor: (src, dest, thickness, color, density, circumference, addBranches) ->
    super(src, dest, thickness, color, density, circumference)
    if addBranches?
      addBranches(@)
    else
      @addBranches(@)
    @strike()

  # Override this method to configure how the lightning bolt looks like
  addBranches: (parentBolt) ->
    for i in [0...4]
      newBolt = parentBolt.addBranch(parentBolt.thickness / 2, 'yellow', parentBolt.density / 2, parentBolt.circumference)
      for j in [0...2]
        newBolt.addBranch(newBolt.thickness / 3, 'orange', newBolt.density / 3, newBolt.circumference)
