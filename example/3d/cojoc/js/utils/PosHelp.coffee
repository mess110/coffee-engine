class PosHelp
  @isOwn = (id) ->
    Persist.getJson('user').id == id

  @draw: (id) ->
    p = { x: 26, y: 7.7, z: 0, rX: 0, rY: Math.PI, rZ: -Math.PI / 2 }
    p.y *= -1 if @isOwn(id)
    p

  @heroPresent2: (id) ->
    p = { x: 2, y: 4, z: 16, rX: 0, rY: 0, rZ: Math.PI / 2 }
    if @isOwn(id)
      p.x *= -1
      p.y *= -1
    p

  @heroPresent: (id) ->
    p = { x: -3, y: 4, z: 16, rX: 0, rY: 0, rZ: Math.PI / 2 }
    if @isOwn(id)
      p.x *= -1
      p.y *= -1
    p

  @hero: (id) ->
    p = { x: 0, y: 11, z: 0, rX: 0, rY: 0, rZ: Math.PI / 2 }
    p.y *= -1 if @isOwn(id)
    p

  @displayed: (id, w) ->
    p = { x: 0, y: 10, z: 11, rX: 0, rY: Math.PI, rZ: 0 }
    if @isOwn(id)
      p.y = -2
      p.rY = 0
    p.x += w
    p

  @held: (id, w) ->
    p = { x: 0, y: 12, z: 14, rX: 0, rY: Math.PI, rZ: 0 }
    if @isOwn(id)
      p.y = -7
      p.rY = 0
    p.x += w
    p

exports.PosHelp = PosHelp
