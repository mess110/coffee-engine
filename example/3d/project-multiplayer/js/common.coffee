common =
  move: (target, inputs) ->
    inputs = [inputs] unless inputs instanceof Array
    for input in inputs
      target.position.x += input.direction.x * input.tpf

  moveInput: (tpf) ->
    {
      type: 'move'
      tpf: tpf
      direction:
        x: 0
    }

exports.common = common
