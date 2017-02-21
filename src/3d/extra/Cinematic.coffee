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

    @_initUI()
    @_loadFog()
    @_loadMaterials()
    @_loadCameras()
    @_loadItems()
    @_loadSceneProperties()

    @loaded = true

  _initUI: ->
    for ceButtonType in Utils.CE_BUTTON_TYPES
      if @json.ui? and @json.ui["#{ceButtonType}Button"]? and @json.ui["#{ceButtonType}Button"].enabled
        @json.ui["#{ceButtonType}Button"].type = ceButtonType
        Helper.addCEButton(@json.ui["#{ceButtonType}Button"])
    if @json.engine.orientation?
      Helper.orientation(@json.engine.orientation)
    Helper.fade(type: 'out')

  _loadFog: ->
    if @json.fog? && @json.fog.enabled
      @scene.fog = Helper.fog(@json.fog)

  _loadMaterials: ->
    for item in @json.assets
      if item.type == 'graffiti'
        # TODO: find out where to move this
        key = Utils.getKeyName(item.destPath, Utils.SAVE_URLS)
        so = SaveObjectManager.get().items[key]

        art = new ArtGenerator(width: so.width, height: so.height)
        art.fromJson(so)

        material = Helper.materialFromCanvas(art.canvas)
        MaterialManager.load(key, material)

  _loadCameras: ->
    for item in @json.cameras
      camera = Helper.camera(item)
      @setId(camera, item)
      @setXYZProp('position', camera, item)
      @setXYZProp('rotation', camera, item)
      if item.lookAt?
        vector = @getLookAtVector(item.lookAt)
        camera.lookAt(vector)
      @cameras.push camera

  _loadItems: ->
    for item in @json.items
      switch item.type
        when 'playlist'
          playlist = new Playlist(item.items)
          @setId(item, item)
          @setId(playlist, item)
          playlist.json = item
          @items.push playlist
        when 'water'
          # recursive hell
          item[item.type] = item
          baseModel = Helper[item.type](engine, @scene, item)
          obj = baseModel.mesh
          @cinemize(item, baseModel, obj)
        when 'mirror'
          # recursive hell
          item[item.type] = item
          baseModel = Helper[item.type](engine, item)
          obj = baseModel.mesh
          @cinemize(item, baseModel, obj)
        when 'terrain', 'particle'
          baseModel = Helper[item.type](item)
          obj = baseModel.mesh
          @cinemize(item, baseModel, obj)
        when 'cube', 'plane', 'model', 'threePointLight', 'sunSetLight', 'ambientLight', 'light', 'pointLight', 'skySphere', 'graffiti', 'forest'
          obj = Helper[item.type](item)
          baseModel = new BaseModel()
          baseModel.mesh = obj
          @cinemize(item, baseModel, obj)
        else
          console.log "unknown item type #{item.type}"

  _loadSceneProperties: ->
    if @json.engine.camera?
      engine.setCamera(@cameras[@json.engine.camera])

  # set properties generated with the UI
  cinemize: (item, baseModel, obj) ->
    @setId(baseModel, item)
    @setId(obj, item)
    @setName(obj, item)
    @setXYZProp('position', obj, item)
    @setXYZProp('rotation', obj, item)
    @setXYZProp('scale', obj, item, 1)
    if item.lookAt?
      # TODO: find out if this is a bug. should the camera be lookin
      # or the model?
      engine.camera.lookAt(@toVector3(item.lookAt))
    @items.push baseModel
    @scene.add baseModel.mesh if @scene

  # Add all items to a scene
  addAll: (scene) ->
    for item in @items
      # TODO: might want more information why the item is not
      # added. Currently, we only add the item if it has a mesh
      # because there are items which do not have a model. Example:
      # playlist
      continue unless item.mesh
      scene.add item.mesh

  # Find an item or a camera by id
  find: (id) ->
    @items.where(ceId: id).first() || @cameras.where(ceId: id).first()

  allMeshes: ->
    meshes = []
    for item in @items
      if item.mesh?
        meshes.push item.mesh
    meshes

  # tick event
  tick: (tpf) ->
    return if @loaded != true

    for item in @items
      if item instanceof BaseParticle2
        item.tick(tpf)

      if item instanceof Mirror
        item.tick(tpf)

      if item instanceof Water
        item.tick(tpf)

    return if @json.scripts.where(processing: true).any()
    script = @json.scripts.where(processed: undefined).first()
    return 'finished' unless script?
    script.processed = true
    script.processing = true

    for action in script.actions
      @processAction(action)

    @setNotProcessing(script)

  # Process an action from a script
  processAction: (action) ->
    action.delay ?= 0

    return unless action.target?
    target = @items.where(ceId: action.target).first()
    unless target?
      target = { mesh: @cameras.where(ceId: action.target).first() }
      isCamera = true if target.mesh?
      unless target.mesh?
        for asset in @json.assets
          if asset.type == 'sound' && Utils.getKeyName(asset.destPath, Utils.AUDIO_URLS) == action.target
            target = { mesh: asset }
            isSound = true
        throw new Error("action.target #{action.target} not found") if !target.mesh? && !isCamera && !isSound

    setTimeout =>
      if isSound
        action.sound.key = action.target
        SoundManager.get().cmd(action.sound)
      else if target.json? && target.json.type == 'playlist'
        # target is a Playlist
        target.cmd(action.sound)
      else
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

  setName: (object, json) ->
    object.name = json.id

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
