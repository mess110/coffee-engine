app = angular.module 'MyApp', [
  'ngMaterial'
]

app.controller 'MainController', ($scope) ->
  $scope.wireframe = false
  $scope.json =
    type: 'bezier'
    curve: '20,157.2,130.02,100.0,150.5,246.2,492,176.3'
    text: 'Calul Nazdravan Brrrr'
    strokeStyle: 'black'
    letterPadding: 7
    drawCurve: true
    x: 0, y: 0

  $scope.$watch 'wireframe', (newValue, oldValue) ->
    bezierScene.toggleWireframe()

  for w in ['curve', 'text', 'letterPadding', 'drawCurve']
    $scope.$watch "json.#{w}", (newValue, oldValue) ->
      bezierScene.updateCurve($scope.json)

class BezierScene extends BaseScene
  constructor: ->
    super()

    @scene.add Helper.ambientLight()

    @scene.fog = Helper.fog(far: 70, color: 'white')
    @scene.add Helper.grid(size: 200, step: 10, color: 'gray')
    engine.setClearColor(@scene.fog.color, 1)

    @art = new ArtGenerator(width: 512, height: 512)

    @plane = new BaseModel()
    @plane.mesh = Helper.plane(width: 10, height: 10, wSegments: 20, hSegments: 20)
    @scene.add @plane.mesh

    @controls = Helper.orbitControls(engine)
    @controls.damping = 0.2

  toggleWireframe: () ->
    @plane.toggleWireframe()

  updateCurve: (json) ->
    @art.fromJson(items: [json])
    material = Helper.materialFromCanvas(@art.canvas)
    material.map.minFilter = THREE.LinearFilter
    @plane.mesh.material = material

  tick: (tpf) ->
    return unless @loaded

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->

config = Config.get()
config.fillWindow()
config.preventDefaultMouseEvents = false

engine = new Engine3D()
engine.camera.position.set 0, 0, 11
config.height = config.height - 204

bezierScene = new BezierScene()
engine.addScene(bezierScene)
engine.render()
