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

renderOrder = 0
firstLoadDone = false

cardsScene = new CardsScene()
gameScene = new GameScene()
menuScene = new MenuScene()
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

  'assets/board.png'
], () ->
  engine.initScene(menuScene)
  firstLoadDone = true
)

engine.addScene(loadingScene)
engine.addScene(menuScene)
engine.addScene(gameScene)
engine.addScene(cardsScene)
engine.render()
