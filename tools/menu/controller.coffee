app.controller 'MenuController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  $scope.menu = [
    { name: 'model viewer', href: 'model-viewer' }
    { name: 'cinematic editor', href: 'cinematic-editor' }
    { name: 'particle playground', href: 'particle-playground' }
    { name: 'terrain generator', href: 'terrain-generator' }
    { name: 'bezier helper', href: 'bezier-helper' }
    { name: 'documentation', href: '../doc/3d/index.html', newWindow: true }
    { name: 'settings', href: 'settings' }
  ]
]
