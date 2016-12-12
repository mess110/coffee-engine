# https://github.com/lmparppei/deadtree/blob/master/deadtree.js
#
# @example
#   wind = new Tree()
#   @wind = 0
#
#   @wind += tpf + Math.random() # shaky
#   @wind = tpf + Math.random() # bend
#
#   @tree.wind(@wind)
#
class Tree extends BaseModel
  constructor: (material, size = 1, children = 5)->
    @mesh = new THREE.Object3D()

    material ?= Helper.sampleShaderMaterial()

    sizeModifier = .65
    @branchPivots = []

    @mesh = @createBranch(size, material, children, false, sizeModifier)

  createBranch: (size, material, children, isChild, sizeModifier) ->
    branchPivot = new (THREE.Object3D)
    branchEnd = new (THREE.Object3D)
    @branchPivots.push branchPivot
    length = Math.random() * size * 10 + size * 5
    endSize = if children == 0 then 0 else size * sizeModifier
    branch = new (THREE.Mesh)(new (THREE.CylinderGeometry)(endSize, size, length, 5, 1, true), material)
    branchPivot.add branch
    branch.add branchEnd
    branch.position.y = length / 2
    branchEnd.position.y = length / 2 - (size * .4)
    if isChild
      branchPivot.rotation.z += Math.random() * 1.5 - (sizeModifier * 1.05)
      branchPivot.rotation.x += Math.random() * 1.5 - (sizeModifier * 1.05)
    else
      branchPivot.rotation.z += Math.random() * .1 - .05
      branchPivot.rotation.x += Math.random() * .1 - .05
    if children > 0
      c = 0
      while c < children
        child = @createBranch(size * sizeModifier, material, children - 1, true, sizeModifier)
        branchEnd.add child
        c++
    branchPivot

  wind: (wind) ->
    for b in @branchPivots
      b.rotation.z += Math.cos(wind * Math.random()) * 0.0005
