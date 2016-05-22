app = angular.module 'MyApp', [
  'ngMaterial'
]

Persist.PREFIX = 'ce.editor'
Persist.defaultJson('workspace',
  gamesDir: 'workspace/games/'
  localLib: 'workspace/lib/'
  modelRepository: 'workspace/lib/models/'
)

app.controller 'MainController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  $scope.menu = [
    { name: 'model viewer', href: 'model-viewer/index.html' }
    { name: 'cinematic editor', href: 'cinematic-editor/index.html' }
    { name: 'particle playground', href: 'particle-playground/index.html' }
    { name: 'terrain generator', href: 'terrain-generator/index.html' }
    { name: 'bezier helper', href: 'bezier-helper/index.html' }
    { name: 'documentation', href: '../doc/3d/index.html', newWindow: true }
    { name: 'settings', href: 'settings/index.html' }
  ]

  $scope.goToMenuItem = (menuItem) ->
    if menuItem.newWindow
      window.open(menuItem.href)
    else
      window.location.href = menuItem.href
]
