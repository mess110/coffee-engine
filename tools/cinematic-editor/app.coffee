fs = require('fs')

app = angular.module 'MyApp', [
  'ngMaterial'
  'mdColorPicker'
]

app.controller 'MainController', ['$scope', '$mdToast', ($scope, $mdToast) ->

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

  $scope.cameraTypes = [
    'PerspectiveCamera'
    'OrthographicCamera'
  ]

  $scope.json =
    engine: {}
    assets: []
    cameras: []
    items: []
    scripts: []

  $scope.toast = (message) ->
    simple = $mdToast.simple().textContent(message).position('bottom left').hideDelay(3000)
    $mdToast.show simple

  $scope.loaded = ->
    data = atob($scope.file.data.toString().replace('data:;base64,', ''))
    $scope.json = JSON.parse(data)
    if $scope.json.engine.camera?
      $scope.ui.preset_camera = true
    $scope.$digest()

  $scope.$watch 'ui.preset_camera', (newValue, oldValue) ->
    if newValue == false
      delete $scope.json.engine.camera

  $scope.shortcut = (event) ->
    console.log event.which
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
    item.endsWithAny(Utils.IMG_URLS)

  $scope.modelFilter = (item) ->
    item.endsWithAny(Utils.JSON_URLS) && !item.endsWithAny(Utils.SAVE_URLS)

  $scope.itemWithIdFilter = (item) ->
    item.id?

  $scope.soundsFilter = (item) ->
    item.endsWithAny(Utils.AUDIO_URLS)

  $scope.save = ->
    unless $scope.json.path?
      $scope.toast('path missing')
      return
    unless $scope.json.path.endsWith('.save.json')
      $scope.toast('path must be a .save.json file')
      return

    string = JSON.stringify(angular.copy($scope.json), null, 2)
    fs.writeFile $scope.json.path, string, (err) ->
      $scope.$digest()
      if err
        return console.log(err)
      $scope.toast('saved')
      return

  $scope.addAsset = ->
    $scope.json.assets.push ''

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
]

app.directive 'fileSelect', ['$window', ($window) ->
  {
    restrict: 'A'
    require: 'ngModel'
    link: (scope, el, attr, ctrl) ->
      fileReader = new ($window.FileReader)

      fileReader.onload = ->
        ctrl.$setViewValue fileReader.result
        if 'fileLoaded' of attr
          scope.$eval attr['fileLoaded']
        return

      fileReader.onprogress = (event) ->
        if 'fileProgress' of attr
          scope.$eval attr['fileProgress'],
            '$total': event.total
            '$loaded': event.loaded
        return

      fileReader.onerror = ->
        if 'fileError' of attr
          scope.$eval attr['fileError'], '$error': fileReader.error
        return

      fileType = attr['fileSelect']
      el.bind 'change', (e) ->
        fileName = e.target.files[0]
        if fileType == '' or fileType == 'text'
          fileReader.readAsText fileName
        else if fileType == 'data'
          fileReader.readAsDataURL fileName
        return
      return

  }
]
