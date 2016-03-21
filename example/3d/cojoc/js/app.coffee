config = Config.get()

# config.toggleDebug()
# config.toggleStats()
config.fillWindow()
config.transparentBackground = true

engine = new Engine3D()
engine.camera.position.z = 50

nm = NetworkManager.get()
nm.connect()

nm.on 'join', (data) ->
  gameScene.join(data)

nm.on 'disconnect', (data) ->
  gameScene.disconnect(data)

nm.on 'serverTick', (data) ->
  gameScene.serverTick(data)

firstLoadDone = false

class PosHelp
  @isOwn = (id) ->
    Persist.getJson('user').id == id

  @draw: (id) ->
    p = { x: 26, y: 7.7, z: 0, rX: 0, rY: Math.PI, rZ: -Math.PI / 2 }
    p.y *= -1 if @isOwn(id)
    p

  @heroPresent2: (id) ->
    p = { x: 2, y: 4, z: 16, rX: 0, rY: 0, rZ: Math.PI / 2 }
    if @isOwn(id)
      p.x *= -1
      p.y *= -1
    p

  @heroPresent: (id) ->
    p = { x: -3, y: 4, z: 16, rX: 0, rY: 0, rZ: Math.PI / 2 }
    if @isOwn(id)
      p.x *= -1
      p.y *= -1
    p

  @hero: (id) ->
    p = { x: 0, y: 11, z: 0, rX: 0, rY: 0, rZ: Math.PI / 2 }
    p.y *= -1 if @isOwn(id)
    p

class RenderOrder
  renderOrder: 0

  get: ->
    @renderOrder += 1
    @renderOrder

renderOrder = new RenderOrder()

cardsScene = new CardsScene()
gameScene = new GameScene()
menuScene = new MenuScene()
sandboxScene = new SandboxScene()
loadingScene = new CojocLoadingScene([
  'assets/babaDochia.png'
  'assets/ileanaCosanzeana.png'
  'assets/zalmoxis.png'

  'assets/corb.png'
  'assets/fireball.png'

  'assets/template.png'
  'assets/cardBack.png'
  'assets/heart.png'
  'assets/mana.png'
  'assets/woodSword.png'

  'assets/glowGreen.png'
  'assets/glowBlue.png'
  'assets/glowYellow.png'
  'assets/glowRed.png'

  'assets/endTurnFront.png'
  'assets/endTurnBack.png'

  'assets/board.png'
], () ->
  engine.initScene(menuScene)
  firstLoadDone = true
)

engine.addScene(loadingScene)
engine.addScene(sandboxScene)
engine.addScene(menuScene)
engine.addScene(gameScene)
engine.addScene(cardsScene)
engine.render()
