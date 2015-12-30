class BaseModel

  visible: true
  mesh: undefined

  getTweenFromPosition: () ->
    {
      x: @mesh.position.x
      y: @mesh.position.y
      z: @mesh.position.z
      rX: @mesh.rotation.x
      rY: @mesh.rotation.y
      rZ: @mesh.rotation.z
    }

  addToPosition: (x, y, z) ->
    @mesh.position.x += x
    @mesh.position.y += y
    @mesh.position.z += z

  setScale: (i) ->
    @mesh.scale.set i, i, i

  setVisible: (b) ->
    @mesh.traverse (object) ->
      object.visible = b
    @visible = b

  toggleWireframe: ->
    return unless @mesh? or @mesh.material?
    @mesh.material.wireframe = !@mesh.material.wireframe

  isHovered: (raycaster) ->
    raycaster.intersectObject(@mesh).length > 0
