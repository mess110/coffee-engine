app.controller 'SettingsController', ['$scope', ($scope) ->
  EngineHolder.get().engine.removeDom()

  $scope.ui.project.name = 'Settings'
  $scope.ui.updateOutput = "Update means stash/pull/stash pop.\nUse if extremely lazy."
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

  $scope.updateCE = ->
    $scope.ui.updating = true
    $scope.ui.updateOutput = "Update started. Please wait."
    $scope.ui.updateError = ''

    puts = (error, stdout, stderr) ->
      $scope.ui.updateOutput = stdout
      $scope.ui.updateError = stderr
      $scope.ui.updating = false
      $scope.$apply()
      return

    exec 'grunt shell:update', puts
]
