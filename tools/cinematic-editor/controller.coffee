app.controller 'CinematicEditorController', ['$document', '$scope', ($document, $scope) ->

  $scope.ui.project.name = $scope.workspace.lastOpenedProject

  $scope.tweenKinds = [
    'Linear'
    'Quadratic'
    'Cubic'
    'Quartic'
    'Quintic'
    'Sinusoidal'
    'Exponential'
    'Circular'
    'Elastic'
    'Back'
    'Bounce'
  ].sort()

  $scope.directionTypes = [
    'None'
    'In'
    'Out'
    'InOut'
  ]

  $scope.soundTypes = [
    'play'
    'pause'
    'stop'
    'fadeIn'
    'fadeOut'
    'volume'
    'volumeAll'
    'loop'
  ]

  $scope.itemTypes = [
    'cube'
    'plane'
    'model'
    'terrain'
    'skySphere'
    'ambientLight'
    'light'
    'mirror'
    'water'
    'particle'
  ]

  $scope.assetTypes = [
    'sound'
    'model'
    'texture'
    'terrain'
    'particle'
  ]

  $scope.cameraTypes = [
    'PerspectiveCamera'
    'OrthographicCamera'
  ]

  onLoad = (data) ->
    $scope.json = JSON.parse(data)
    if $scope.json.engine.camera?
      $scope.ui.preset_camera = true

  $scope.json =
    engine: {}
    assets: []
    cameras: []
    items: []
    scripts: []

  if $scope.workspace.lastOpenedScene?
    file = $scope.workspace.lastOpenedScene
    data = fs.readFileSync(file, 'utf8')
    onLoad(data)

  $scope.loaded = ->
    data = atob($scope.file.data.toString().replace('data:;base64,', ''))
    onLoad(data)
    $scope.$digest()

  $scope.$watch 'ui.preset_camera', (newValue, oldValue) ->
    if newValue == false
      delete $scope.json.engine.camera

  $scope.targetableObjects = ->
    $scope.json.items.concat($scope.json.cameras)

  $scope.hasAnimate = (id) ->
    $scope.json.items.where(id: id).any()

  $scope.hasMapAttr = (type) ->
    ['plane', 'skySphere', 'water'].includes(type)

  $scope.hasCoordinates = (type) ->
    ['cube', 'plane', 'model', 'light', 'mirror', 'water', 'terrain', 'particle'].includes(type)

  $scope.hasRadiusAndSegments = (type) ->
    ['skySphere'].includes(type)

  $scope.hasColor = (item) ->
    planeHasColor = true
    if item.type == 'plane'
      if item.map?
        planeHasColor = false
    ['light', 'ambientLight', 'plane', 'mirror'].includes(item.type) && planeHasColor

  $scope.hasWidthHeight = (item) ->
    ['mirror', 'plane', 'water'].includes(item.type)

  $scope.hasTextureWidthHeight = (item) ->
    ['mirror', 'water'].includes(item.type)

  $scope.hasWidthHeightSegments = (item) ->
    ['plane', 'water'].includes(item.type)

  $scope.getKeyName = (asset) ->
    if asset.endsWithAny(Utils.SAVE_URLS)
      Utils.getKeyName(asset, Utils.SAVE_URLS)
    else if asset.endsWithAny(Utils.JSON_URLS)
      Utils.getKeyName(asset, Utils.JSON_URLS)
    else if asset.endsWithAny(Utils.IMG_URLS)
      Utils.getKeyName(asset, Utils.IMG_URLS)
    else if asset.endsWithAny(Utils.AUDIO_URLS)
      Utils.getKeyName(asset, Utils.AUDIO_URLS)
    else
      asset

  $scope.mapFilter = (item) ->
    return false unless item.destPath
    item.destPath.endsWithAny(Utils.IMG_URLS)

  $scope.modelFilter = (item) ->
    return false unless item.destPath
    item.destPath.endsWithAny(Utils.JSON_URLS) && !item.destPath.endsWithAny(Utils.SAVE_URLS)

  $scope.terrainFilter = (item) ->
    return false unless item.destPath
    item.type == 'terrain'

  $scope.particleFilter = (item) ->
    return false unless item.destPath
    item.type == 'particle'

  $scope.itemWithIdFilter = (item) ->
    item.id?

  $scope.soundsFilter = (item) ->
    return false unless item.destPath
    item.destPath.endsWithAny(Utils.AUDIO_URLS)

  $scope.save = ->
    unless $scope.json.id?
      $scope.toast('id missing')
      return

    path = fileSystem.getScenePath($scope.workspace, $scope.json.id)
    unless path.endsWith('.save.json')
      $scope.toast('path must be a .save.json file')
      return

    # set default values
    for script in $scope.json.scripts
      for action in script.actions
        if action.animate?
          action.animate.loop = false unless action.animate.loop?

    string = JSON.stringify(angular.copy($scope.json), null, 2)
    fs.writeFileSync path, string
    $scope.toast("saved scene '#{$scope.json.id}'")

  $scope.addAsset = ->
    $scope.json.assets.push {}

  $scope.removeAsset = (asset) ->
    $scope.json.assets.remove(asset)

  $scope.defaultCamera = (camera) ->
    camera.type = Utils.CAMERA_DEFAULT_TYPE
    camera.view_angle = Utils.CAMERA_DEFAULT_VIEW_ANGLE
    camera.near = Utils.CAMERA_DEFAULT_NEAR
    camera.far = Utils.CAMERA_DEFAULT_FAR
    camera

  $scope.addCamera = ->
    obj = $scope.defaultCamera {}
    $scope.json.cameras.push obj

  $scope.removeCamera = (camera) ->
    $scope.json.cameras.remove(camera)

  $scope.defaultItem = (item) ->
    if item.type == 'plane'
      delete item.map
      item.color = Utils.PLANE_DEFAULT_COLOR
      item.width = Utils.PLANE_DEFAULT_WIDTH
      item.height = Utils.PLANE_DEFAULT_HEIGHT
      item.wSegments = Utils.PLANE_DEFAULT_W_SEGMENTS
      item.hSegments = Utils.PLANE_DEFAULT_H_SEGMENTS
    if item.type == 'skySphere'
      item.radius = Utils.SKY_SPHERE_DEFAULT_RADIUS
      item.segments = Utils.SKY_SPHERE_DEFAULT_SEGMENTS
    if item.type == 'ambientLight'
      item.color = Utils.AMBIENT_LIGHT_DEFAULT_COLOR
    if item.type == 'light'
      item.color = Utils.LIGHT_DEFAULT_COLOR
      item.position =
        x: Utils.LIGHT_DEFAULT_POSITION_X
        y: Utils.LIGHT_DEFAULT_POSITION_Y
        z: Utils.LIGHT_DEFAULT_POSITION_Z
    if item.type == 'mirror'
      item.color = Utils.MIRROR_DEFAULT_COLOR
      item.width = Utils.PLANE_DEFAULT_WIDTH
      item.height = Utils.PLANE_DEFAULT_HEIGHT
      item.clipBias = Utils.MIRROR_DEFAULT_CLIP_BIAS
      item.textureWidth = Utils.MIRROR_DEFAULT_TEXTURE_WIDTH
      item.textureHeight = Utils.MIRROR_DEFAULT_TEXTURE_HEIGHT
    if item.type == 'water'
      item.width = Utils.PLANE_DEFAULT_WIDTH
      item.height = Utils.PLANE_DEFAULT_HEIGHT
      item.wSegments = Utils.PLANE_DEFAULT_W_SEGMENTS
      item.hSegments = Utils.PLANE_DEFAULT_H_SEGMENTS
      item.textureWidth = Utils.MIRROR_DEFAULT_TEXTURE_WIDTH
      item.textureHeight = Utils.MIRROR_DEFAULT_TEXTURE_HEIGHT
      item.sunColor = Utils.LIGHT_DEFAULT_COLOR
      item.waterColor = Utils.WATER_DEFAULT_WATER_COLOR
      item.alpha = Utils.WATER_DEFAULT_ALPHA

  $scope.addItem = ->
    $scope.json.items.push {}

  $scope.removeItem = (item) ->
    $scope.json.items.remove(item)

  $scope.addScript = ->
    $scope.json.scripts.push { actions: [] }

  $scope.addScriptAction = (script) ->
    script.actions.push {}

  $scope.removeScript = (script) ->
    $scope.json.scripts.remove(script)

  $scope.onAssetSelect = (asset, result) ->
    asset.libPath = result.libPath
    unless asset.destPath?
      asset.destPath = "assets/#{asset.libPath.split('/').last()}"
    dependencies = fileSystem.copyAssetSync($scope.workspace, asset)

    for dependency in dependencies
      $scope.json.assets.push dependency

  cinematicShortcuts = (event) ->
    if event.ctrlKey && event.which == 19
      $scope.save()

  $document.bind 'keypress', cinematicShortcuts

  $scope.$on '$destroy', ->
    $document.unbind 'keypress', cinematicShortcuts
    return

  return
]
