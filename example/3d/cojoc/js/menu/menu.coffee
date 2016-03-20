app = angular.module('app', ['ngRoute'])

getScope = ->
  angular.element(document.body).scope()

auth =
  onlyLoggedIn: ($location, $q) ->
    deferred = $q.defer()
    user = Persist.getJson('user')
    # if user? and user.id? and user.name?
    if 1 == 1
      deferred.resolve()
    else
      deferred.reject()
      $location.url '/login'
    deferred.promise

app.config ['$routeProvider', ($routeProvider) ->
  $routeProvider
    .when('/login', templateUrl: 'views/login.html', controller: 'LoginController')
    .when('/logout', templateUrl: 'views/logout.html', controller: 'LogoutController', resolve: auth)
    .when('/home', templateUrl: 'views/home.html', controller: 'HomeController', resolve: auth)
    .when('/games/:id', templateUrl: 'views/game.html', controller: 'GameController', resolve: auth)
    .when('/cards', templateUrl: 'views/cards.html', controller: 'CardsController', resolve: auth)
    .when('/choose-hero', templateUrl: 'views/choose_hero.html', controller: 'ChooseHeroController', resolve: auth)
    .otherwise redirectTo: '/home'
  return
]

app.run ($rootScope, $interval, $location) ->
  $rootScope.hide =
    menu: true
    logo: false

  $rootScope.$on '$routeChangeStart', (event, next, current) ->
    #event.stopPropagation();  //if you don't want event to bubble up 
    return

  loadingCheck = $interval ->
    if loadingScene.isLoadingDone() and firstLoadDone
      $interval.cancel(loadingCheck)
      $rootScope.hide.menu = false
  , 10
