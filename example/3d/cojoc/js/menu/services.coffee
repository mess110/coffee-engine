app.service 'gameTicker', ($interval) ->
  Persist.defaultJson('game', {})
  @game = Persist.getJson('game')
  @referee = new Referee(constants)

  @start = ->
    @interval = $interval =>
      @referee.tick(@game)
      gameScene.serverTick(@game)
      @referee.clearInputs(@game)
    , 250

  @stop = ->
    $interval.cancel(@interval)

  @addInput = (data) ->
    @game.inputs.push data

  @setGame = (game) ->
    @game = game
    Persist.setJson('game', game)

  @hasGame = () ->
    return @game.id?

  @newBotGame = (user) ->
    pq = new PlayerQueue()
    pq.push user
    game = pq.getPair()
    game = @referee.startGame(game)
    @setGame(game)
    game

  return

app.service 'facebook', () ->
  window.fbAsyncInit = ->
    FB.init
      appId: '788840621188524'
      xfbml: true
      version: 'v2.5'
    return

  @login = ->
    FB.login ((response) ->
      if response.status == 'connected'
        FB.api '/me', (me) ->
          Persist.setJson('user', me, {})
          scope = getScope()
          scope.$apply ->
            scope.auth(me)
            return
      else if response.status == 'not_authorized'
        # The person is logged into Facebook, but not your app.
      else
        # The person is not logged into Facebook, so we're not sure if
        # they are logged into this app or not.
      return
    ), scope: 'public_profile,email'

  return
