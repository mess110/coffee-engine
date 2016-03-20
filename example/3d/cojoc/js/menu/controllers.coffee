app.controller 'GameController', ($scope, $interval, gameTicker) ->
  $scope.hide.logo = true
  $scope.inGame = false

  loadingCheck = $interval ->
    unless gameTicker.hasGame()
      engine.initScene(menuScene)
      $interval.cancel(loadingCheck)
      $scope.goto('/home')
      return
    if loadingScene.isLoadingDone() and firstLoadDone
      $interval.cancel(loadingCheck)
      engine.initScene(gameScene)
      gameTicker.start()
  , 10

app.controller 'CardsController', ($scope) ->
  $scope.hide.logo = true
  $scope.onLoadSetScene(cardsScene)

app.controller 'LoginController', ($scope) ->

app.controller 'LogoutController', ($scope, $location) ->
  Persist.rm('user')
  $location.path('/home')

app.controller 'ChooseHeroController', ($scope, gameTicker) ->
  $scope.hide.logo = true
  $scope.hintBig = 'Choose a hero'

  $scope.heroChosen = false
  $scope.user = Persist.getJson('user')

  $scope.selectDeck = (deck) ->
    $scope.myDeck = deck
    $scope.hintBig = deck.name
    $scope.hintSmall = deck.description

  # Assumption: only bot games
  $scope.play = ->
    $scope.user.vsBot = true
    $scope.user.deckId = $scope.myDeck.id
    game = gameTicker.newBotGame($scope.user)
    $scope.goto("/games/#{game.id}")

  $scope.decks = constants.decks

app.controller 'HomeController', ($scope, gameTicker) ->
  $scope.hide.logo = false
  gameTicker.stop()

  $scope.play = ->
    if gameTicker.hasGame()
      $scope.goto("/games/#{gameTicker.game.id}")
    else
      $scope.goto('/choose-hero')

app.controller 'MainController', ($scope, $location, $interval, gameTicker, facebook) ->

  $scope.addInput = (data) ->
    gameTicker.addInput(data)

  $scope.finishedLoading = ->
    loadingScene.isLoadingDone() and firstLoadDone

  $scope.backToHome = ->
    engine.initScene(menuScene)
    $scope.goto('/home')

  $scope.onLoadSetScene = (scene) ->
    loadingCheck = $interval ->
      if $scope.finishedLoading()
        $interval.cancel(loadingCheck)
        engine.initScene(scene)
    , 10

  $scope.toggleFullScreen = ->
    Helper.toggleFullScreen()

  $scope.goto = (url) ->
    $location.path(url)

  $scope.auth = (user) ->
    $location.path('/home')

  $scope.login = ->
    facebook.login()

