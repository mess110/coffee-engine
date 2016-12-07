Helper.fade(type: 'in', duration: 0)

Utils.FADE_DEFAULT_DURATION = 250

config = Config.get()
config.fillWindow()
config.transparentBackground = true
# config.toggleStats()

LoadingScene.prototype.preStart = ->

nm = NetworkManager.get()
nm.connect()

nm.on 'error', (data) ->
  scope = getScope()
  scope.game.connected = false

nm.on 'connected', (data) ->
  scope = getScope()
  scope.game.connected = true
  scope.start()

nm.on 'join', (data) ->

nm.on 'disconnect', (data) ->
  gameScene.disconnect(data)

engine = new Engine3D()
Helper.fancyShadows(engine.renderer)

gameScene = new GameScene()
engine.addScene(gameScene)

menuScene = new MenuScene()
engine.addScene(menuScene)

cardsScene = new CardsScene()
engine.addScene(cardsScene)

Engine3D.scenify(engine, ->
  document.getElementById("loading").style.opacity = 0
  scope = getScope()
  scope.game.loaded = true
  scope.start()
)

engine.render()
