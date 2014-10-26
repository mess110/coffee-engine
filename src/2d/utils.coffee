class Utils
  @rgbToHex = (r, g, b) ->
    throw "Invalid color component"  if r > 255 or g > 255 or b > 255
    ((r << 16) | (g << 8) | b).toString 16
