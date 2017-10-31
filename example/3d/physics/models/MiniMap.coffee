class MiniMap extends BaseModel
  constructor: ->
    super()

    @mesh = Helper.plane(map: 'track00')
