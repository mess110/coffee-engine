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

    # add a score
    #
    # @param [String] name
    # @param [Number] score
    addScore: (name, score) ->
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

  @get: () ->
    instance ?= new Singleton.HighScoreManager()
