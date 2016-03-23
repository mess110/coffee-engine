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
  'assets/heal.png'
  'assets/calulNazdravan.png'
  'assets/iele.png'

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

  'assets/noise.jpg'
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
