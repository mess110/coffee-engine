config = Config.get()
config.fillWindow()

Hodler.get().engine = new Engine3D()
engine = Hodler.get().engine
engine.camera.position.set 7.4, 11.8, 10.1

modelViewerScene = new ModelViewerScene()
engine.addScene(modelViewerScene)

bezierScene = new BezierScene()
engine.addScene(bezierScene)

terrainGeneratorScene = new TerrainGeneratorScene()
engine.addScene(terrainGeneratorScene)

heightmapGeneratorScene = new HeightmapGeneratorScene()
engine.addScene(heightmapGeneratorScene)

particlePlaygroundScene = new ParticlePlaygroundScene()
engine.addScene(particlePlaygroundScene)

shaderEditorScene = new ShaderEditorScene()
engine.addScene(shaderEditorScene)

graffitiPainterScene = new GraffitiPainterScene()
engine.addScene(graffitiPainterScene)

Hodler.get().engine.removeDom()
engine.start()
