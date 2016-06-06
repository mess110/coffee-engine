app.controller 'SettingsController', ['$scope', ($scope) ->
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
]
