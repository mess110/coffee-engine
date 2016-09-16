# Class used for walking a mesh over another mesh
class Walker
  # By default it checks beneath
  constructor: (mesh, x = 0, y = -1, z = 0) ->
    @mesh = mesh
    @raycaster = new THREE.Raycaster()
    @direction = new THREE.Vector3(x, y, z)

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

  intersects: (meshes) ->
    unless meshes?
      console.log 'walker.intersects needs a mesh'
      return
    meshes = [].concat(meshes)

    fromPosition = @mesh.position.clone()
    @raycaster.set(fromPosition, @direction)
    @raycaster.intersectObjects(meshes)

  first: (meshes) ->
    @intersects(meshes).first()

  fromWorldDirection: ->
    @mesh.getWorldDirection(@direction)
    @
