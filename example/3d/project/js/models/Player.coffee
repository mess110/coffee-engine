class Player extends BaseModel
  constructor: ->
    @mesh = Helper.cube()
    @ghost = Helper.cube()
    @ghost.material.wireframe = true

  move: (inputs) ->
    common.move(@mesh, inputs)

  interpolate: (tpf) ->
    # TODO: find a nice way to interpolate
    if @mesh.position.x < @ghost.position.x
      common.move(@mesh, direction: { x: 5 }, tpf: tpf)
    if @mesh.position.x > @ghost.position.x
      common.move(@mesh, direction: { x: -5 }, tpf: tpf)
