# @example
#   lookAt = new LookAtTimer(engine.camera, mesh)
#
#   lookAt.tick(tpf)
class LookAtTimer
  constructor: (from, mesh) ->
    @mesh = mesh
    @walker = new Walker(from)
    @amount = 0
    @enabled = true

  tick: (tpf) ->
    return unless @enabled

    intersection = @walker.fromWorldDirection().intersects(@mesh).first()
    if intersection?
      @amount += tpf
      @amount = 1 if @amount > 1
    else
      @amount -= tpf
      @amount = 0 if @amount < 0

    @_transform(tpf)

  isSelected: ->
    @amount == 1

  _transform: (tpf) ->
    @mesh.scale.set 1 + @amount, 1 + @amount, 1 + @amount
