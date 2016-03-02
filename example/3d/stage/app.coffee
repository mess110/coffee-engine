rainbow = new Rainbow()
rainbow.setSpectrum('red', 'white')
rainbow.setNumberRange(1, 20)

if not localStorage.getItem('localStorageInitialized')
  localStorage.setItem('localStorageInitialized', 'yezzer')
  localStorage.setItem('spotLightColorEffect', 'yezzer')
  localStorage.setItem('bloodEffect', 'yezzer')

tm = TextureManager.get()
jm = JsonModelManager.get()

vj = new VirtualController()
vj.joystick2.addEventListener 'touchStart', ->
  cs = SceneManager.get().currentScene()
  cs.shooting = true

config = Config.get()
config.fillWindow()
config.maxNameLength = 14
config.name = prompt("name (14 chars max)", "AAA")
config.name = 'AAA' unless config.name?
config.name = config.name.substring(0, config.maxNameLength)
config.sendHighScores = document.location.hostname != "localhost"
config.spotLightColorEffect = localStorage.getItem('spotLightColorEffect')
config.bloodEffect = localStorage.getItem('bloodEffect')

jNorthPole.BASE_URL = 'https://json.northpole.ro/'
`// please don't :)`
jNorthPole.API_KEY = atob('YWN0aQ==')
jNorthPole.SECRET = atob('YWN0aV9wbHpfbjBfaDRja3o')

camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
engine = new Engine3D()
engine.setCamera(camera)
camera.position.set 0, 20, 27
camera.lookAt(new (THREE.Vector3)(0, 0, 0))

SoundManager.get().add('shotgun', 'sounds/shotgun.wav')
SoundManager.get().add('hit', 'sounds/hit.wav')

Helper.fancyShadows(engine.renderer)

Number::toRoman = ->
  num = Math.floor(this)
  return 'O' if num == 0
  val = undefined
  s = ''
  i = 0
  v = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  r = [ 'M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']

  toBigRoman = (n) ->
    ret = ''
    n1 = ''
    rem = n
    while rem > 1000
      prefix = ''
      suffix = ''
      n = rem
      s = '' + rem
      magnitude = 1
      while n > 1000
        n /= 1000
        magnitude *= 1000
        prefix += '('
        suffix += ')'
      n1 = Math.floor(n)
      rem = s - (n1 * magnitude)
      ret += prefix + n1.toRoman() + suffix
    ret + rem.toRoman()

  if this - num or num < 1
    num = 0
  if num > 3999
    return toBigRoman(num)
  while num
    val = v[i]
    while num >= val
      num -= val
      s += r[i]
    ++i
  s

class BloodParticle extends BaseParticle
  constructor: ->
    @particleGroup = new (SPE.Group)(
      texture: tm.items['splatter']
      maxAge: 0.2
      blending: THREE.NormalBlending
      hasPerspective: true
      colorize: true
    )

    @emitter = new (SPE.Emitter)(
      position: new (THREE.Vector3)(0, 0, 0)
      positionSpread: new (THREE.Vector3)(2, 2, 2)
      acceleration: new (THREE.Vector3)(0, 0, 0)
      accelerationSpread: new (THREE.Vector3)(0, 0, 0)
      velocity: new (THREE.Vector3)(0, 0, -20)
      velocitySpread: new (THREE.Vector3)(10, 10, 10)
      colorStart: new (THREE.Color)('red')
      colorMiddle: new (THREE.Color)('red')
      colorEnd: new (THREE.Color)('red')
      sizeStart: 0
      sizeMiddle: 4
      sizeEnd: 5
      particleCount: 1000)

    @particleGroup.addEmitter @emitter
    @mesh = @particleGroup.mesh

class GameScene extends BaseScene
  constructor: ->
    super()

    @particle2 = new BloodParticle()
    @particle2.emitter.disable()
    @scene.add @particle2.mesh

    @splats = []
    @bunnies = []
    @started = false
    @cameraTweening = false
    @score = 0
    @ambientLights = [Helper.ambientLight(), Helper.ambientLight(), Helper.ambientLight(), Helper.ambientLight()]
    @killingSpree = 0
    @shooting = false

    box = new (THREE.BoxGeometry)(1, 1, 1)
    mat = new (THREE.MeshPhongMaterial)(color: 0xff0000)

    @spotLight = new SpotLight(0, 30, 25)
    @spotLight.addToScene(@scene)

    @spawnBunny(true)

    @dynamicTexture  = new THREEx.DynamicTexture(256,256)
    @dynamicTexture.context.font = "24px 'Forum' cursive"
    @dynamicTexture.drawText('')
    dgeometry = new (THREE.PlaneBufferGeometry)(10, 10)
    @dmaterial = new (THREE.MeshBasicMaterial)(map: @dynamicTexture.texture, transparent: true, opacity: 0)
    @floatingCombatText = new (THREE.Mesh)(dgeometry, @dmaterial)
    # @floatingCombatText.position.y = 100
    @scene.add @floatingCombatText

    @bear = jm.clone('bear_all')
    @bear.receiveShadow = true
    @bear.castShadow = true
    @bear.position.set 0, 0, 0
    @bear.animations[0].play()
    @bear.speed = 5
    @scene.add @bear
    @spotLight.lookAt(@bear) if @bear?
    @cameraPosition(0)

    @shotgun = jm.clone('shotgun')
    @shotgun.receiveShadow = true
    @shotgun.castShadow = true
    # @shotgun.position.set 0, 0, -10
    @shotgun.animations[1].loop = false
    @shotgun.scale.set 0.3, 0.3, 0.3
    @shotgun.position.set 0, 3, 2.5
    @bear.add @shotgun

    @particle = new BaseParticle(
      group:
        textureUrl: 'imgs/star.png'
        maxAge: 0.2
        colorize: true
        hasPerspective: true
        blending: 2 # AdditiveBlending
        transparent: true
        alphaTest: 0.5
    )
    @particle.mesh.rotation.set Math.PI / 2, 0, 0
    @particle.mesh.position.set 0, 0.75, 5
    @particle.mesh.visible = false
    @shotgun.add @particle.mesh

    @drapesBg = jm.clone('drapes')
    @drapesBg.receiveShadow = true
    @drapesBg.castShadow = true
    @drapesBg.position.set 0, 0, -15
    @drapesBg.scale.set 3.5, 2, 1
    # @scene.add @drapesBg

    @drapes = jm.clone('drapes2')
    @drapes.receiveShadow = true
    @drapes.castShadow = true
    @drapes.opened = false
    @drapes.position.set 0, 0, 15
    @drapes.scale.x = 2
    # @scene.add @drapes

    @mask = jm.clone('theater_mask')
    @mask.receiveShadow = true
    @mask.castShadow = true
    @mask.position.set 0, 16, 16
    @scene.add @mask

    texture = tm.items['diffuse']
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set 6, 6

    mat = new (THREE.MeshPhongMaterial)(
      shininess: 0
      map: texture
      combine: THREE.MixOperation
      # side: THREE.DoubleSide
      reflectivity: 0.00)

    geometry = new (THREE.PlaneGeometry)(80, 80, 32)
    material = new (THREE.MeshBasicMaterial)(
      color: 0xffff00
      side: THREE.DoubleSide)
    @plane = new (THREE.Mesh)(geometry, mat)
    @plane.receiveShadow = true
    @plane.castShadow = true
    @plane.position.z = -20
    @plane.rotation.set -Math.PI / 2, 0, Math.PI / 2
    @scene.add @plane

    @raycaster = new THREE.Raycaster()

    @splatElevation = 0

    @splatTexture = tm.items['splatter']

    @loaded = true

  mkSplat: (pos) ->
    return if not config.bloodEffect
    @splatElevation += 0.0003
    @splatMat = new (THREE.MeshPhongMaterial)(
      map: @splatTexture
      transparent: true
      opacity: 0.0
    )
    splatGeometry = new (THREE.PlaneBufferGeometry)(5, 5)
    splat = new (THREE.Mesh)(splatGeometry, @splatMat)
    splat.receiveShadow = true
    splat.position.set pos.x, @splatElevation, pos.z
    splat.rotation.set -Math.PI / 2, 0, Math.random() * Math.PI
    @splats.push splat
    @scene.add splat

  toggleLights: ->
    action = if @lights then 'remove' else 'add'
    for light in @ambientLights
      @scene[action](light)
    @lights = !@lights

  tick: (tpf) ->
    return unless @loaded

    @particle.tick(tpf) if @particle?
    @particle2.tick(tpf) if @particle2?

    @mask.castShadow = !@drapes.opened && @selectedCameraPosition != 1 if @mask and @drapes

    @floatingCombatText.position.y += tpf
    if @dmaterial.opacity - tpf <= 0
      @dmaterial.opacity = 0
    else
      @dmaterial.opacity -= tpf

    if @bear? and @shotgun? and @bunnies.any()
      @spotLight.lookAt(@bear)
      @moving = false

      return if @gameOver

      if (@keyboard.pressed(' ') or @shooting) and !@shotgun.animations[1].isPlaying
        @toggleDrapes() if not @started

        @shotgun.animations[1].play()
        @particle.mesh.visible = true
        setTimeout =>
          @particle.mesh.visible = false
        , 150
        snd = SoundManager.get().sounds['shotgun']
        snd.volume = 0.4
        snd.playbackRate = 1.3
        snd.play('shotgun')

        if not @started
          @spotLight.setColor("white")
          return

        matrix = new (THREE.Matrix4)
        matrix.extractRotation @bear.matrix
        direction = new (THREE.Vector3)(0, 0, 1)
        direction.applyMatrix4(matrix)

        @raycaster.set(@bear.position, direction)
        intersects = @raycaster.intersectObjects(@bunnies)
        if intersects.any()
          @killingSpree += 1 if @killingSpree <= 8
          pnt = intersects[0].point

          if config.bloodEffect
            @particle2.mesh.position.set pnt.x, pnt.y + 2, pnt.z
            @particle2.mesh.lookAt(@bear.position)
            @particle2.emitter.enable()

          reactionHitVector = pnt.clone().add(direction.clone().normalize().multiplyScalar(40))
          reactionHitVector.y = @getRandomArbitrary(20, 30)

          geometry = new (THREE.Geometry)
          geometry.vertices.push @bear.position
          geometry.vertices.push reactionHitVector
          @scene.remove @line
          @line = new (THREE.Line)(geometry, new (THREE.LineBasicMaterial)(color: 'gold'))
          # @scene.add @line

          SoundManager.get().play('hit')
          # hit = Math.floor(@killingSpree * pnt.distanceTo(@bear.position) / 3)
          hit = @killingSpree
          hit = 1 if hit < 1
          @score += hit
          @dynamicTexture.clear()
          @dynamicTexture.drawText("+#{hit.toRoman()}", 32, 64, '#fefefe')
          @dmaterial.opacity = 1
          @floatingCombatText.lookAt(camera.position)
          @floatingCombatText.position.copy(pnt)

          document.getElementById('count').innerHTML = @score.toRoman()
          document.getElementById('count').className = 'more-points'
          setTimeout ->
            document.getElementById('count').className = ''
          , 700

          intersected = intersects.first().object
          bunnySpawnPoint = @getBunnySpawnPoint()
          bunnyPosition = intersected.position.clone()

          intersected.dead = true

          tween = new (TWEEN.Tween)(bunnyPosition).to(reactionHitVector, 6000).onUpdate(->
            intersected.position.set @x, @y, @z
            return
          ).easing(TWEEN.Easing.Exponential.Out)
          .onComplete(=>
            intersected.position.copy(bunnySpawnPoint)
            intersected.dead = false
            intersected.position.y = 0
            intersected.animations[1].play()
            delete intersected.deathAnimated
          ).start()

          setTimeout =>
            @particle2.emitter.disable()
            @mkSplat(pnt)
            @spawnBunny()
          , 350
        else
          @killingSpree = 0

      return if not @started

      if @keyboard.pressed('w') or @keyboard.pressed('up') or vj.joystick1.up()
        @moving = true
        @bear.translateZ(tpf * @bear.speed)
      if @keyboard.pressed('s') or @keyboard.pressed('down') or vj.joystick1.down()
        @moving = true
        @bear.translateZ(-tpf * @bear.speed)

      if @keyboard.pressed('a') or @keyboard.pressed('left') or vj.joystick1.left()
        @moving = true
        @bear.rotation.y += tpf * @bear.speed / 2
      if @keyboard.pressed('d') or @keyboard.pressed('right') or vj.joystick1.right()
        @moving = true
        @bear.rotation.y -= tpf * @bear.speed / 2

      if @bear.animations[0].isPlaying and @moving
        @bear.animations[1].play()
        @bear.animations[0].stop()

      if @bear.animations[1].isPlaying and !@moving
        @bear.animations[0].play()
        @bear.animations[1].stop()

      for splat in @splats
        if splat.material.opacity < 0.5
          splat.material.opacity += tpf

      closestDistToBear = 30
      for bunny in @bunnies
        bunny.lookAt(@bear.position) if not bunny.dead
        bunny.translateZ(tpf * bunny.speed) if @moving
        distToBear = bunny.position.distanceTo(@bear.position)

        if not bunny.dead
          if distToBear < 2.5
            @gameOver = true
            @toggleDrapes()
            @resetScene()

        if bunny.dead and not bunny.deathAnimated
          bunny.deathAnimated = true
          bunny.animations[0].stop()
          bunny.animations[1].stop()
          bunny.animations[2].play()
        else
          if distToBear < closestDistToBear
            closestDistToBear = distToBear

          if bunny.animations[0].isPlaying and @moving
            bunny.animations[0].stop()
            bunny.animations[1].play()
            bunny.animations[2].stop()

          if bunny.animations[1].isPlaying and !@moving
            bunny.animations[0].play()
            bunny.animations[1].stop()
            bunny.animations[2].stop()

      if config.spotLightColorEffect
        colorDest = rainbow.colourAt(closestDistToBear)
        @spotLight.setColor("##{colorDest}")
      else
        @spotLight.setColor("white")
    @shooting = false

  jNorthPoleError: (data, status) ->
    document.getElementById('highscore').className = 'hidden'
    console.log "jNorthPole error: #{status}"
    console.log data

  getHighScores: ->
    jNorthPole.getStorage({ api_key: jNorthPole.API_KEY, secret: jNorthPole.SECRET, '__limit': 5, '__sort': { score: 'desc' } }, (data) ->
      s = ''
      for u in data
        # u.score might not be a number for whatever reason
        try
          s += "<li>#{u.name.substring(0, config.maxNameLength)} <span class='highlight'>#{u.score.toRoman()}</span></li>"
        catch err
          console.log u
          console.log err
      document.getElementById('highscoreList').innerHTML = s
    , @jNorthPoleError)

  resetScene: ->
    @spotLight.setColor('white')
    jNorthPole.createStorage({ name: config.name.substring(0, config.maxNameLength), score: @score, api_key: jNorthPole.API_KEY, secret: jNorthPole.SECRET }, (data) ->
      console.log data
      SceneManager.get().currentScene().getHighScores()
    , @jNorthPoleError)

    @cameraPosition(0)
    setTimeout =>
      @bear.position.set 0, 0, 0
      @bear.rotation.set 0, 0, 0
      for bunny in @bunnies
        @scene.remove(bunny)
      @bunnies = []
      for splat in @splats
        @scene.remove(splat)
      @splats = []
      @splatElevation = 0
      @started = false
      @gameOver = false
      @killingSpree = 0
      @scene.remove @line
      @floatingCombatText.position.y = 100
      @spawnBunny(true)
    , 1000

  getRandomArbitrary: (min, max) ->
    Math.random() * (max - min) + min

  spawnBunny: (first = false)->
    bunny = jm.clone('bunny_all')

    bunny.receiveShadow = true
    bunny.castShadow = true
    if first
      bunny.position.set 2, 0, 20
    else
      bunny.position.copy @getBunnySpawnPoint()
    bunny.scale.set 0.5, 0.5, 0.5
    bunny.animations[1].play()
    bunny.animations[2].loop = false
    bunny.speed = 3
    bunny.dead = false

    @bunnies.push bunny
    @scene.add bunny

  cameraPosition: (i = 0) ->
    return if @cameraTweening
    @cameraTweening = true
    e = [
      { x: 0, y: 20, z: 27 }
      { x: 0, y: 33, z: 0 }
    ][i]
    @selectedCameraPosition = i
    @cameraTweening = true

    @tweenMoveTo({ position: new (THREE.Vector3)(e.x, e.y, e.z) }, camera, 500)
    setTimeout =>
      @tweenLookAt({ position: new (THREE.Vector3)(0, 0, 0) }, camera, 500)
    , 501
    setTimeout =>
      @cameraTweening = false
    , 1001

  toggleCamera: ->
    i = if @selectedCameraPosition == 0 then 1 else 0
    @cameraPosition(i)

  getBunnySpawnPoint: () ->
    angle = Math.random()*Math.PI*2
    radius = @getRandomArbitrary(20, 30)

    {
      x: Math.cos(angle) * radius
      y: 0
      z: Math.sin(angle) * radius
    }

  toggleDrapes: ->
    return if @drapes.animations[0].isPlaying
    count = document.getElementById('count')
    menu = document.getElementById('menu')
    help = document.getElementById('help')
    score = document.getElementById('score')
    highscore = document.getElementById('highscore')

    if @started == false
      @score = 0
      count.innerHTML = @score.toRoman()

      menu.className = 'hidden'
      help.className = 'hidden'
      score.className = 'visible'
      highscore.className = 'hidden'
    else
      menu.className = 'visible'
      help.className = 'visible'
      highscore.className = 'visible'
    @started = true
    @drapes.animations[0].play()
    setTimeout =>
      @drapes.opened = !@drapes.opened
    , if @drapes.opened then (@drapes.animations[0].data.length * 1000 - 100) / 3 else (@drapes.animations[0].data.length * 1000 - 100) / 4 * 3 - 150
    setTimeout =>
      @drapes.animations[0].stop()
      @drapes.animations[0].timeScale *= -1
    , @drapes.animations[0].data.length * 1000 - 100

  doMouseEvent: (event, raycaster) ->

  doKeyboardEvent: (event) ->
    return unless event.type == 'keyup'
    return unless @drapes?

    @cameraPosition(0) if event.which == 49
    @cameraPosition(1) if event.which == 50
    @toggleCamera() if event.which == 67
    if event.which == 86
      if config.spotLightColorEffect?
        localStorage.removeItem("spotLightColorEffect")
      else
        localStorage.setItem("spotLightColorEffect", "yezzer")
      config.spotLightColorEffect = localStorage.getItem('spotLightColorEffect')
    if event.which == 66
      if config.bloodEffect?
        localStorage.removeItem("bloodEffect")
      else
        localStorage.setItem("bloodEffect", "yezzer")
      config.bloodEffect = localStorage.getItem('bloodEffect')

objs = [
  './models/bear_all.json'
  './models/bunny_all.json'
  './models/shotgun.json'
  './models/drapes.json'
  './models/drapes2.json'
  './models/theater_mask.json'

  './imgs/splatter.png'
  './models/diffuse.png'
  './imgs/star.png'
]

loadingScene = new LoadingScene objs, ->
  gameScene = new GameScene()
  engine.addScene(gameScene)
  engine.sceneManager.setScene(gameScene)
engine.addScene(loadingScene)
engine.render()
