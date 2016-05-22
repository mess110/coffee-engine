fs = require('fs')
glob = require('glob')

Persist.PREFIX = 'ce.editor'

app = angular.module 'MyApp', [
  'ngMaterial'
  'mdColorPicker'
]

app.controller 'MainController', ['$scope', '$mdToast', ($scope, $mdToast) ->

  $scope.ui = {
    workspaceDirsKeys: ['gamesDir', 'localLib', 'modelRepository']
    workspaceDirs: []
  }

  for key in $scope.ui.workspaceDirsKeys
    methodName = "load_#{key}"
    $scope[methodName]= (event) ->
      s = event.target.files[0].path
      $scope.json[key] = s
      Persist.setJson('workspace', $scope.json)
      $scope.$apply()

    $scope.ui.workspaceDirs.push {
      key: key, method: $scope[methodName]
    }

  $scope.json = Persist.getJson('workspace') || {}

  $scope.toast = (message) ->
    simple = $mdToast.simple().textContent(message).position('bottom left').hideDelay(3000)
    $mdToast.show simple

  $scope.shortcut = (event) ->
    if event.ctrlKey and event.which == 19
      $scope.save()
]

app.directive 'customOnChange', ->
  {
    restrict: 'A'
    link: (scope, element, attrs) ->
      onChangeHandler = scope.$eval(attrs.customOnChange)
      element.bind 'change', onChangeHandler
      return

  }
