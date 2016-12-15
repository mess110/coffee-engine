try
  Utils = require('../shared/Utils.coffee').Utils
catch e
  console.ce e

# There can be many games running on a GameServer
#
# Each one has its own tick interval and is independent
# from other games
class GameInstance

  # Creates a new game and start ticking
  constructor: (config) ->
    @players = {}
    @sockets = {}
    @inputs = []

    @id = Utils.guid()
    @config = config
    @setTickInterval(@config.ticksPerSecond)

  # This methods needs to be implemented by a class which extends the Game
  # It says what happens in a game tick.
  tick: =>
    throw 'tick needs to be implemented'

  # Change tick interval of the Game
  #
  # @param [Number] tps
  setTickInterval: (tps) ->
    @config.ticksPerSecond = tps
    clearInterval(@tickInterval) if @tickInterval?
    @tickInterval = setInterval @tick, 1000 / @config.ticksPerSecond

exports.GameInstance = GameInstance
