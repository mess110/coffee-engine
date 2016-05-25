app.controller 'CinematicEditorController', ['$scope', '$mdToast', '$mdDialog', ($scope, $mdToast, $mdDialog) ->

  $scope.ui = {}

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
    'ambientLight'
    'light'
    'skySphere'
  ]

  $scope.assetTypes = [
    'sound'
    'model'
    'texture'
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

  $scope.toast = (message) ->
    simple = $mdToast.simple().textContent(message).position('bottom left').hideDelay(3000)
    $mdToast.show simple

  $scope.loaded = ->
    data = atob($scope.file.data.toString().replace('data:;base64,', ''))
    onLoad(data)
    $scope.$digest()

  $scope.$watch 'ui.preset_camera', (newValue, oldValue) ->
    if newValue == false
      delete $scope.json.engine.camera

  $scope.shortcut = (event) ->
    if event.ctrlKey and event.which == 19
      $scope.save()

  $scope.targetableObjects = ->
    $scope.json.items.concat($scope.json.cameras)

  $scope.hasAnimate = (id) ->
    $scope.json.items.where(id: id).any()

  $scope.hasMapAttr = (type) ->
    ['plane', 'skySphere'].includes(type)

  $scope.hasCoordinates = (type) ->
    ['cube', 'plane', 'model', 'light'].includes(type)

  $scope.hasRadiusAndSegments = (type) ->
    ['skySphere'].includes(type)

  $scope.hasColor = (item) ->
    planeHasColor = true
    if item.type == 'plane'
      if item.map?
        planeHasColor = false
    ['light', 'ambientLight', 'plane'].includes(item.type) && planeHasColor

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

  $scope.itemWithIdFilter = (item) ->
    item.id?

  $scope.soundsFilter = (item) ->
    return false unless item.destPath
    item.destPath.endsWithAny(Utils.AUDIO_URLS)

  $scope.save = ->
    unless $scope.json.path?
      $scope.toast('path missing')
      return
    unless $scope.json.path.endsWith('.save.json')
      $scope.toast('path must be a .save.json file')
      return

    string = JSON.stringify(angular.copy($scope.json), null, 2)
    fs.writeFile $scope.json.path, string, (err) ->
      if err
        return console.log(err)
      $scope.$digest()
      $scope.toast('saved')
      return

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

  $scope.openAssetSearch = ($event, asset) ->
    $mdDialog.show(
      controller: AssetSearchController
      controllerAs: 'ctrl'
      templateUrl: 'cinematic-editor/asset_search.tmpl.html'
      parent: angular.element(document.body)
      targetEvent: $event
      clickOutsideToClose: true
      locals:
        asset: asset
    ).then((result) ->
      asset.libPath = result.libPath
      unless asset.destPath?
        asset.destPath = "assets/#{asset.libPath.split('/').last()}"

      fileSystem.copyAssetSemiSync($scope.workspace, asset)
    )
  return
]

AssetSearchController = ($timeout, $q, $scope, $mdDialog, asset) ->
  self = this
  # list of `state` value/display objects
  # ******************************
  # Internal methods
  # ******************************

  ###*
  # Search for states... use $timeout to simulate
  # remote dataservice call.
  ###

  querySearch = (query) ->
    if query then self.states.filter(createFilterFor(query)) else self.states

  ###*
  # Build `states` list of key/value pairs
  ###

  loadAll = ->
    workspace = Persist.getJson('workspace')
    switch asset.type
      when 'texture'
        WorkspaceQuery.getTextures(workspace, (err, textures) ->
          self.states = textures
          $scope.$apply()
        )
      when 'model'
        WorkspaceQuery.getJsonModels(workspace, (err, models) ->
          self.states = models
          $scope.$apply()
        )
      when 'sound'
        WorkspaceQuery.getSounds(workspace, (err, sounds) ->
          self.states = sounds
          $scope.$apply()
        )
      else
        console.log 'unknown asset type'

  ###*
  # Create filter function for a query string
  ###

  createFilterFor = (query) ->
    lowercaseQuery = angular.lowercase(query)
    (state) ->
      state.libPath.contains(lowercaseQuery)

  loadAll()
  self.querySearch = querySearch
  # ******************************
  # Template methods
  # ******************************

  self.cancel = ($event) ->
    $mdDialog.cancel()
    return

  self.finish = ($event) ->
    $mdDialog.hide(self.selectedItem)
    return

  return
