app = angular.module('app', ['ngRoute'])

app.config ($routeProvider) ->
  $routeProvider.when('/',
    templateUrl: 'views/landing.html'
    controller: 'LandingController'
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

app.controller 'MainController', ($scope, $location) ->
  $scope.goTo = (url) ->
    $location.path(url)

app.controller 'LandingController', ($scope) ->

app.controller 'LeaderboardsController', ($scope) ->

app.controller 'GamesController', ($scope) ->

app.controller 'GameController', ($scope) ->

app.controller 'NewGameController', ($scope) ->

app.controller 'SettingsController', ($scope) ->
