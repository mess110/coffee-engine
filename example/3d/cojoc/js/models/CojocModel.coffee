class CojocModel extends BaseModel
  glow: (value, which) ->
    glow = @["glow#{which.capitalizeFirstLetter()}"]
    throw new Error("glow #{which} does not exist") unless glow?
    glow.setVisible(value)
