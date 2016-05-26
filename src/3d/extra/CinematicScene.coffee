# BaseScene can either be from 3d or 2d engine
class CinematicScene extends BaseScene
  # Create a CinematicScene from json
  @fromJson: (json) ->
    new CinematicScene(json)

  # Create a CinematicScene from SaveObjectManager
  @fromSaveObjectKey: (key) ->
    json = SaveObjectManager.get().items[key]
    @fromJson(json)

  # @see Cinematic
  constructor: (json) ->
    super()
    @cinematic = new Cinematic(json, @scene)
    @controls = Helper.orbitControls(engine)

  # @nodoc
  tick: (tpf) ->
    @cinematic.tick(tpf)

  # @nodoc
  doMouseEvent: (event, ray) ->

  @getAssets: (key) ->
    SaveObjectManager.get().items[key].assets
