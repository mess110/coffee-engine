app = angular.module('app', ['ngRoute', 'ngAnimate', 'toastr'])

app.config ($routeProvider) ->
  $routeProvider.when('/',
    templateUrl: 'views/landing.html'
    controller: 'LandingController'
  ).when('/cards',
    templateUrl: 'views/cards.html'
    controller: 'CardsController'
  ).when('/leaderboards',
    templateUrl: 'views/leaderboards.html'
    controller: 'LeaderboardsController'
  ).when('/settings',
    templateUrl: 'views/settings.html'
    controller: 'SettingsController'
  ).when('/games',
    templateUrl: 'views/games.html'
    controller: 'GamesController'
  ).when('/games/new',
    templateUrl: 'views/new-game.html'
    controller: 'NewGameController'
  ).when('/games/:id',
    templateUrl: 'views/game.html'
    controller: 'GameController'
  ).otherwise redirectTo: '/'
  return

app.controller 'MainController', ($scope, $location, toastr) ->
  $scope.game =
    loaded: false
    connected: false

  $scope.play = ->
    toastr.success('Not implemented')

  $scope.cards = ->
    engine.initScene(cardsScene, {}, true)
    $scope.goTo('/cards')

  $scope.home = ->
    engine.initScene(menuScene, {}, true)
    $scope.goTo('/')

  $scope.goTo = (url) ->
    $location.path(url)

  $scope.start = () ->
    if $scope.game.loaded && $scope.game.connected
      if $location.path() == '/cards'
        scene = gameScene
      else
        scene = menuScene

      engine.initScene(scene, {}, false)

app.controller 'LandingController', ($scope) ->

app.controller 'CardsController', ($scope) ->

app.controller 'LeaderboardsController', ($scope) ->

app.controller 'GamesController', ($scope) ->

app.controller 'GameController', ($scope) ->

app.controller 'NewGameController', ($scope) ->

app.controller 'SettingsController', ($scope) ->

getScope = ->
  angular.element(document.body).scope()
