# FIFO
class PlayerQueue
  queue: []

  constructor: ->

  # add a player to the queue
  #
  # {
  #   id: id
  #   name: 'Name'
  #   vsBot: false
  # }
  push: (player) ->
    # TODO validate player
    @queue.push player

  # remove the first player fromt the queue
  shift: () ->
    @queue.shift()

  clear: ->
    @queue = []

  any: ->
    @queue.any()

  getPair: ->
    return unless @any()
    return if @queue.size() == 1 and !@queue[0].vsBot

    player1 = @shift()
    player2 = if player1.vsBot then { id: 'bot', name: 'bot' } else @shift()

    {
      player1: player1
      player2: player2
    }

exports.PlayerQueue = PlayerQueue
