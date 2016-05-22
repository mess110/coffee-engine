fs = require('fs')

app = angular.module 'MyApp', [
  'ngMaterial'
]

app.controller 'MainController', ['$scope', '$mdToast', ($scope, $mdToast) ->

  $scope.ui = {}

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
    'OrtographicCamera'
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

  $scope.hasMapAttr = (type) ->
    ['plane', 'skySphere'].includes(type)

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

  $scope.save = ->
    unless $scope.json.path?
      $scope.toast('path missing')
      return
    unless $scope.json.path.endsWith('.save.json')
      $scope.toast('path must be a .save.json file')
      return

    string = JSON.stringify(angular.copy($scope.json), null, 2)
    console.log $scope.json.assets
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
