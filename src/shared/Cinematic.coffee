# BaseScene can either be from 3d or 2d engine
class Cinematic extends BaseScene
  @fromJson: (json) ->
    new Cinematic(json)

  @fromSaveObjectKey: (key) ->
    json = SaveObjectManager.get().items[key]
    @fromJson(json)

  constructor: (json) ->
    super()

    @cameras = []
    @items = []
    @json = json

    for item in @json.cameras
      camera = Helper.camera(item)
      @setId(camera, item)
      @setXYZProp('position', camera, item)
      @setXYZProp('rotation', camera, item)
      # if item.lookAt?
        # vector = @getLookAtVector(item.lookAt)
        # camera.lookAt(vector)
      @cameras.push camera

    for item in @json.items
      switch item.type
        when 'cube', 'plane', 'model', 'ambientLight', 'light', 'skySphere'
          obj = Helper[item.type](item)
          baseModel = new BaseModel()
          baseModel.mesh = obj

          @setId(baseModel, item)
          @setId(obj, item)
          @setXYZProp('position', obj, item)
          @setXYZProp('rotation', obj, item)
          @setXYZProp('scale', obj, item, 1)
          if item.lookAt?
            camera.lookAt(@toVector3(item.lookAt))
          @scene.add obj
          @items.push baseModel
        else
          console.log "unknown item type #{item.type}"

    if json.engine.camera?
      engine.setCamera(@cameras[json.engine.camera])

    @loaded = true

  tick: (tpf) ->
    return if @loaded = false

    return if @json.scripts.where(processing: true).any()
    script = @json.scripts.where(processed: undefined).first()
    return unless script?
    script.processed = true
    script.processing = true

    for action in script.actions
      @processAction(action)
    @setNotProcessing(script)


  doMouseEvent: (event, ray) ->

  processAction: (action) ->
    action.delay ?= 0
    throw new Error('action.target required') unless action.target?
    target = @items.where(ceId: action.target).first()
    throw new Error("action.target #{action.target} not found") unless target?
    setTimeout =>
      if action.lookAt?
        vector = @getLookAtVector(action.lookAt)
        target.mesh.lookAt(vector)
      if action.animate?
        target.animate(null, action.animate)
      if action.tween?
        action.tween.mesh = target.mesh
        Helper.tween(action.tween).start()
    , action.delay

  setNotProcessing: (script) ->
    duration = @getScriptDuration(script)
    setTimeout =>
      script.processing = false
    , duration

  getScriptDuration: (script) ->
    longestTween = 0
    for action in script.actions
      if action.tween?
        actionDuration = action.tween.duration || Helper.defaultTweenDuration
        if actionDuration > longestTween
          longestTween = actionDuration
    longestTween

  getLookAtVector: (json) ->
    vector = @toVector3(json)
    for coord in ['x', 'y', 'z']
      vector[coord] += json["offset#{coord.toUpperCase()}"] || 0
    vector

  toVector3: (hash) ->
    hash.x ?= 0
    hash.y ?= 0
    hash.z ?= 0
    new THREE.Vector3(hash.x, hash.y, hash.z)

  setId: (object, json) ->
    object.ceId = json.id

  setXYZProp: (prop, object, json, def = 0) ->
    json[prop] ?= {}
    for coordinate in ['x', 'y', 'z']
      json[prop][coordinate] ?= def
      continue if typeof json[prop][coordinate] != 'string'
      if json[prop][coordinate].contains('PI')
        newJs = json[prop][coordinate].replace('PI', 'Math.PI')
        json[prop][coordinate] = eval(newJs)
    object[prop].set json[prop].x, json[prop].y, json[prop].z
