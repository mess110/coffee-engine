class PoolTestModel extends BaseModel
  constructor: ->
    @mesh = Helper.cube(size: 0.5)

class PoolTest extends TestScene
  init: ->
    super()
    StatsManager.setVisible(true)

    PoolManager.on 'spawn', PoolTestModel, (item) ->
      pos = Helper.random(-2, 2)
      item.mesh.position.set pos, 0, pos
      Helper.tween(
        relative: true
        mesh: item.mesh
        target:
          y: 3
      ).start()
      console.log 'spawned'
      SceneManager.currentScene().scene.add item.mesh

    PoolManager.onRelease PoolTestModel, (item) ->
      console.log 'released'
      SceneManager.currentScene().scene.remove item.mesh

  tick: (tpf) ->
    second = parseInt(@uptime)
    if second != @second
      itemsInUse = PoolManager.get().itemsInUse[PoolTestModel]
      if itemsInUse? && itemsInUse.any()
        PoolManager.release(itemsInUse.first())

      item = PoolManager.spawn(PoolTestModel)
      @scene.add item.mesh

      @second = second

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
