class CojocModel extends BaseModel
  glow: (value, which) ->
    glow = @["glow#{which.capitalizeFirstLetter()}"]
    throw new Error("glow #{which} does not exist") unless glow?
    glow.setVisible(value)

  setPosition: (pos) ->
    super(pos)
    rX = if pos.rX? then pos.rX else @mesh.rotation.x
    rY = if pos.rY? then pos.rY else @mesh.rotation.y
    rZ = if pos.rZ? then pos.rZ else @mesh.rotation.z
    @mesh.rotation.set rX, rY, rZ
