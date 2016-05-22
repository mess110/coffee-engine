app = angular.module 'MyApp', [
  'ngMaterial'
]

app.controller 'MainController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  $scope.menu = [
    { name: 'model viewer', href: 'model-viewer/index.html' }
    { name: 'cinematic editor', href: 'cinematic-editor/index.html' }
    { name: 'particle playground', href: 'particle-playground/index.html' }
    { name: 'terrain generator', href: 'terrain-generator/index.html' }
    { name: 'bezier helper', href: 'bezier-helper/index.html' }
  ]

  $scope.goToMenuItem = (menuItem) ->
    window.location.href = menuItem.href
]
