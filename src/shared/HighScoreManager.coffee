# @nodoc
class HighScoreManager

  instance = null

  # Manages high scores
  #
  # @example
  #   # To register a new user/game
  #   jNorthPole.createUser('api_key', 'secret')
  #
  # @example
  #   hsm = HighScoreManager.get()
  #   hsm.api_key = 'api_key'
  #   hsm.secret = 'secret'
  #
  #   hsm.addScore('kiki', 210)
  #   hsm.getScores(20) # highest 20 scores
  #
  #   hsm.responseHandler = (data) ->
  #     # do something else
  class Singleton.HighScoreManager
    apiKey: 'guest'
    secret: 'guest'

    # Set apiKey and secret and attempt to register if tryRegister is true
    #
    # @param [String] apiKey
    # @param [String] secret
    # @param [Boolean] tryRegister default false
    auth: (apiKey, secret, tryRegister = false) ->
      if tryRegister
        jNorthPole.createUser(apiKey, secret, (data) ->
          console.log "api key registered: #{apiKey}"
        )
      @_setTokens(apiKey, secret)
      @_ensureTokenPresence()
      @

    # Set apiKey and secret
    #
    # @param [String] apiKey
    # @param [String] secret
    _setTokens: (apiKey, secret) ->
      @apiKey = apiKey
      @secret = secret

    # add a score
    #
    # @param [String] name
    # @param [Number] score
    addScore: (name, score) ->
      @_ensureTokenPresence()
      throw new Error('name required') unless name?
      throw new Error('score needs to be a number') unless isNumeric(score)

      json =
        api_key: @apiKey
        secret: @secret
        type: 'highscore'
        name: name
        score: score
      jNorthPole.createStorage json, @responseHandler, @errorHandler

    # get scores
    #
    # @param [Number] limit
    getScores: (limit = 10, order = 'desc') ->
      @_ensureTokenPresence()
      json =
        api_key: @apiKey
        secret: @secret
        type: 'highscore'
        __limit: limit
        __sort: { score: order }
      jNorthPole.getStorage json, @responseHandler, @errorHandler

    # override this
    responseHandler: (data) ->
      console.log data

    # override this
    errorHandler: (data, status) ->
      console.log data

    _ensureTokenPresence: ->
      throw new Error('apiKey missing') unless @apiKey?
      throw new Error('secret missing') unless @secret?

  @get: () ->
    instance ?= new Singleton.HighScoreManager()

  @auth: (apiKey, secret, tryRegister) ->
    @get().auth(apiKey, secret, tryRegister)

  @addScore: (name, score) ->
    @get().addScore(name, score)

  @getScores: (limit, order) ->
    @get().getScores(limit, order)
