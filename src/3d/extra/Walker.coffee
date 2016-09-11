# Class used for walking a mesh over another mesh
class Walker
  constructor: (mesh) ->
    @mesh = mesh
    @raycaster = new THREE.Raycaster()
    @direction = new THREE.Vector3(0, -2, 0)

  getContact: (mesh) ->
    unless mesh?
      console.log 'walker.getContact needs a mesh'
      return

    fromPosition = @mesh.position.clone()
    @raycaster.set(fromPosition, @direction)
    intersects = @raycaster.intersectObject(mesh)
    if intersects.size() > 0
      intersects.first().point
    else
      null
