# A base class for holding meshes.
class BaseModel

  visible: true
  mesh: undefined

  # @param [Number] i the new scale
  setScale: (i) ->
    @mesh.scale.set i, i, i

  # Sets object visibility recursively.
  #
  # @param [Boolean] value
  setVisible: (value) ->
    @mesh.traverse (object) ->
      object.visible = value
    @visible = value

  # Toggles model wireframe
  toggleWireframe: ->
    return unless @mesh? or @mesh.material?
    @mesh.material.wireframe = !@mesh.material.wireframe

  # Checked weather the raycaster intersects the mesh
  #
  # @param [Raycaster] raycaster
  isHovered: (raycaster) ->
    raycaster.intersectObject(@mesh).length > 0
