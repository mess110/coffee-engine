common =
  move: (target, inputs) ->
    inputs = [inputs] unless inputs instanceof Array
    for input in inputs
      target.position.x += input.direction.x * input.tpf

exports.common = common
