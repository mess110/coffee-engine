assert = require('assert')

require('../../bower_components/coffee-engine/src/shared/SyntaxSugar')
PlayerQueue = require('../../js/server/PlayerQueue').PlayerQueue

describe 'PlayerQueue', ->
  before ->
    @pq = new PlayerQueue()

  afterEach ->
    @pq.clear()

  it 'has an empty array', ->
    assert.equal(0, @pq.queue.length)

  it 'adds a player to the queue', ->
    @pq.push { id: 1, name: 'kiki' }
    assert.equal(1, @pq.queue.length)

  it 'has any method', ->
    assert.equal(false, @pq.any())
    @pq.push { id: 1, name: 'kiki' }
    assert.equal(true, @pq.any())

  describe 'getPair()', ->
    it 'returns nothing if the queue is empty', ->
      assert.equal(undefined, @pq.getPair())

    it 'returns a game if there is a player who wants to play vs bot', ->
      @pq.push { id: 1, name: 'kiki', vsBot: true}
      assert.notEqual(undefined, @pq.getPair())

    it 'returns a game if there are more than 2 players in the queue', ->
      @pq.push { id: 1, name: 'kiki'}
      @pq.push { id: 2, name: 'boom'}
      assert.notEqual(undefined, @pq.getPair())
      assert.equal(false, @pq.any())

    it 'only takes care of the first 2 players', ->
      @pq.push { id: 1, name: 'kiki'}
      @pq.push { id: 2, name: 'boom'}
      @pq.push { id: 3, name: 'bastic'}
      @pq.getPair()
      assert.equal(true, @pq.any())
      assert.equal(1, @pq.queue.size())
