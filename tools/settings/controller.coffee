app.controller 'SettingsController', ['$scope', '$mdToast', ($scope, $mdToast) ->
  EngineHolder.get().engine.removeDom()

  $scope.ui.project.name = 'Settings'
  $scope.settings = {
    workspaceDirsKeys: ['gamesDir', 'localLib', 'modelRepository']
    workspaceDirs: []
  }

  for key in $scope.settings.workspaceDirsKeys
    methodName = "load_#{key}"
    $scope[methodName]= (event) ->
      s = event.target.files[0].path
      $scope.workspace[key] = s
      Persist.setJson('workspace', $scope.workspace)
      $scope.$apply()

    $scope.settings.workspaceDirs.push {
      key: key, method: $scope[methodName]
    }

  $scope.toast = (message) ->
    simple = $mdToast.simple().textContent(message).position('bottom left').hideDelay(3000)
    $mdToast.show simple

  $scope.shortcut = (event) ->
    if event.ctrlKey and event.which == 19
      $scope.save()
]
