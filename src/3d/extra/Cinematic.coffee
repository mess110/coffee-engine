# Base class for holding cinematic data
class Cinematic
  # Constructor
  #
  # If the scene parameter is given, it will add the items to the
  # scene automatically
  #
  # @param [JSON] json
  # @param [Scene] scene
  constructor: (json, scene) ->
    @loaded = false

    if scene?
      @scene = scene

    @cameras = []
    @items = []
    @json = json

    for item in @json.cameras
      camera = Helper.camera(item)
      @setId(camera, item)
      @setXYZProp('position', camera, item)
      @setXYZProp('rotation', camera, item)
      if item.lookAt?
        vector = @getLookAtVector(item.lookAt)
        camera.lookAt(vector)
      @cameras.push camera

    for item in @json.items
      switch item.type
        when 'terrain'
          baseModel = Helper[item.type](item)
          obj = baseModel.mesh
          @cinemize(item, baseModel, obj)
        when 'cube', 'plane', 'model', 'ambientLight', 'light', 'skySphere'
          obj = Helper[item.type](item)
          baseModel = new BaseModel()
          baseModel.mesh = obj
          @cinemize(item, baseModel, obj)
        else
          console.log "unknown item type #{item.type}"

    if @json.engine.camera?
      engine.setCamera(@cameras[@json.engine.camera])

    @loaded = true

  # set properties generated with the UI
  cinemize: (item, baseModel, obj) ->
    @setId(baseModel, item)
    @setId(obj, item)
    @setXYZProp('position', obj, item)
    @setXYZProp('rotation', obj, item)
    @setXYZProp('scale', obj, item, 1)
    if item.lookAt?
      # TODO: find out if this is a bug. should the camera be lookin
      # or the model?
      camera.lookAt(@toVector3(item.lookAt))
    @items.push baseModel
    @scene.add baseModel.mesh if @scene

  # Add all items to a scene
  addAll: (scene) ->
    for item in @items
      scene.add item.mesh

  # tick event
  tick: (tpf) ->
    return if @loaded != true

    return if @json.scripts.where(processing: true).any()
    script = @json.scripts.where(processed: undefined).first()
    return unless script?
    script.processed = true
    script.processing = true

    for action in script.actions
      @processAction(action)
    @setNotProcessing(script)

  # Process an action from a script
  processAction: (action) ->
    action.delay ?= 0

    if action.sound?
      SoundManager.get().cmd(action.sound)

    return unless action.target?
    target = @items.where(ceId: action.target).first()
    unless target?
      target = { mesh: @cameras.where(ceId: action.target).first() }
      isCamera = true
      throw new Error("action.target #{action.target} not found") unless target.mesh?
    setTimeout =>
      if action.lookAt?
        vector = @getLookAtVector(action.lookAt)
        target.mesh.lookAt(vector)
      if action.animate? and isCamera != true
        if action.animate.stopOtherAnimations?
          target.stopAnimations()
        target.animate(null, action.animate)
      if action.tween?
        action.tween.mesh = target.mesh
        Helper.tween(action.tween).start()
    , action.delay

  # @nodoc
  setNotProcessing: (script) ->
    duration = @getScriptDuration(script)
    console.log duration
    setTimeout =>
      script.processing = false
    , duration

  # Returns the ms duration of a script
  getScriptDuration: (script) ->
    longestDuration = 0
    for action in script.actions
      if action.animate?
        if action.animate.loop != true
          # HACK: should not convert to number
          animateDuration = action.animate.waitScript || 0
          animateDuration += action.delay || 0
          if animateDuration > longestDuration
            longestDuration = animateDuration

      if action.tween?
        actionDuration = action.tween.duration || Helper.defaultTweenDuration
        actionDuration += action.delay || 0
        if actionDuration > longestDuration
          longestDuration = actionDuration
    longestDuration

  # @nodoc
  getLookAtVector: (json) ->
    vector = @toVector3(json)
    for coord in ['x', 'y', 'z']
      vector[coord] += json["offset#{coord.toUpperCase()}"] || 0
    vector

  # @nodoc
  toVector3: (hash) ->
    hash.x ?= 0
    hash.y ?= 0
    hash.z ?= 0
    new THREE.Vector3(hash.x, hash.y, hash.z)

  # @nodoc
  setId: (object, json) ->
    object.ceId = json.id

  # @nodoc
  setXYZProp: (prop, object, json, def = 0) ->
    json[prop] ?= {}
    for coordinate in ['x', 'y', 'z']
      json[prop][coordinate] ?= def
      continue if typeof json[prop][coordinate] != 'string'
      if json[prop][coordinate].contains('PI')
        newJs = json[prop][coordinate].replace('PI', 'Math.PI')
        json[prop][coordinate] = eval(newJs)
    object[prop].set json[prop].x, json[prop].y, json[prop].z
