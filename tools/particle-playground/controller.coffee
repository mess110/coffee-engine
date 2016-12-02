app.controller 'ParticlePlaygroundController', ($scope) ->
  fuglyString = [
    "["
    "  {"
    "    texture: {"
    "      value: TextureManager.get().items['sprite-explosion2'],"
    "      libPath: '../workspace/lib/textures/sprite-explosion2.png',"
    "      frames: new THREE.Vector2(5, 5),"
    "      loop: 1"
    "    },"
    "    depthTest: true,"
    "    depthWrite: false,"
    "    blending: THREE.AdditiveBlending,"
    "    scale: 600,"
    "    emitters: ["
    "      {"
    "        particleCount: 20,"
    "        type: SPE.distributions.SPHERE,"
    "        position: {"
    "          radius: 1"
    "        },"
    "        maxAge: {"
    "          value: 2"
    "        },"
    "        activeMultiplier: 20,"
    "        velocity: {"
    "          value: new THREE.Vector3(10)"
    "        },"
    "        size: {"
    "          value: [20, 100]"
    "        },"
    "        color: {"
    "          value: [new THREE.Color(0.5, 0.1, 0.05), new THREE.Color(0.2, 0.2, 0.2)]"
    "        },"
    "        opacity: {"
    "          value: [0.5, 0.35, 0.1, 0]"
    "        }"
    "      }, {"
    "        particleCount: 50,"
    "        position: {"
    "          spread: new THREE.Vector3(5, 5, 5)"
    "        },"
    "        velocity: {"
    "          spread: new THREE.Vector3(30),"
    "          distribution: SPE.distributions.SPHERE"
    "        },"
    "        size: {"
    "          value: [2, 20, 20, 20]"
    "        },"
    "        maxAge: {"
    "          value: 2"
    "        },"
    "        activeMultiplier: 2000,"
    "        opacity: {"
    "          value: [0.5, 0.25, 0, 0]"
    "        }"
    "      }"
    "    ]"
    "  },"
    "  {"
    "    texture: {"
    "      value: TextureManager.get().items['smokeparticle'],"
    "      libPath: '../workspace/lib/textures/smokeparticle.png'"
    "    },"
    "    depthTest: false,"
    "    depthWrite: true,"
    "    blending: THREE.NormalBlending,"
    "    emitters: ["
    "      {"
    "        particleCount: 100,"
    "        type: SPE.distributions.SPHERE,"
    "        position: {"
    "          radius: 0.1"
    "        },"
    "        maxAge: {"
    "          value: 2"
    "        },"
    "        activeMultiplier: 40,"
    "        velocity: {"
    "          value: new THREE.Vector3(100)"
    "        },"
    "        acceleration: {"
    "          value: new THREE.Vector3(0, -20, 0),"
    "          distribution: SPE.distributions.BOX"
    "        },"
    "        size: {"
    "          value: 2"
    "        },"
    "        drag: {"
    "          value: 1"
    "        },"
    "        color: {"
    "          value: [new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 0), new THREE.Color(1, 0, 0), new THREE.Color(0.4, 0.2, 0.1)]"
    "        },"
    "        opacity: {"
    "          value: [0.4, 0]"
    "        }"
    "      }, {"
    "        particleCount: 50,"
    "        position: {"
    "          spread: new THREE.Vector3(10, 10, 10),"
    "          distribution: SPE.distributions.SPHERE"
    "        },"
    "        maxAge: {"
    "          value: 2"
    "        },"
    "        activeMultiplier: 2000,"
    "        velocity: {"
    "          value: new THREE.Vector3(8, 3, 10),"
    "          distribution: SPE.distributions.SPHERE"
    "        },"
    "        size: {"
    "          value: 40"
    "        },"
    "        color: {"
    "          value: new THREE.Color(0.2, 0.2, 0.2)"
    "        },"
    "        opacity: {"
    "          value: [0, 0, 0.2, 0]"
    "        }"
    "      }, {"
    "        particleCount: 200,"
    "        type: SPE.distributions.DISC,"
    "        position: {"
    "          radius: 5,"
    "          spread: new THREE.Vector3(5)"
    "        },"
    "        maxAge: {"
    "          value: 2,"
    "          spread: 0"
    "        },"
    "        activeMultiplier: 2000,"
    "        velocity: {"
    "          value: new THREE.Vector3(40)"
    "        },"
    "        rotation: {"
    "          axis: new THREE.Vector3(1, 0, 0),"
    "          angle: Math.PI * 0.5,"
    "          static: true"
    "        },"
    "        size: {"
    "          value: 2"
    "        },"
    "        color: {"
    "          value: [new THREE.Color(0.4, 0.2, 0.1), new THREE.Color(0.2, 0.2, 0.2)]"
    "        },"
    "        opacity: {"
    "          value: [0.5, 0.2, 0]"
    "        }"
    "      }"
    "    ]"
    "  }"
    "]"
    ].join("\n")
  $scope.jsonInput = fuglyString

  $scope.ui.project.name = 'Particle Playground'
  $scope.options =
    clearColor: '#000000'

  workspaceQuery.getTextures($scope.workspace, (err, files) ->
    $scope.textures = files
    $scope.$apply()
  )

  getFoo = (json) ->
    string = angular.copy(json)
    results = []
    lines = string.split("\n")
    for line in lines
      continue if !line.contains('libPath') && !line.containsAny(Utils::IMG_URLS)
      imgPath = line.split("'")[1]
      results.push imgPath
    results

  $scope.refresh = (json) ->
    json = $scope.jsonInput unless json?

    for imgPath in getFoo(json)
      key = Utils.getKeyName(imgPath, Utils.IMG_URLS)
      TextureManager.get().load(key, imgPath, ->)

    particlePlaygroundScene.refresh(json)
    $scope.particle = particlePlaygroundScene.particle

  $scope.saveJson = ->
    string = angular.copy($scope.jsonInput)
    hash =
      textures: []
      particle: string

    for imgPath in getFoo(string)
      hash.textures.push
        libPath: imgPath.replace('../', '')
        destPath: "assets/#{imgPath.split('/').last()}"
        type: 'texture'

    Utils.saveFile(hash, 'particle.save.json')

  $scope.particleLoaded = (params, particle) ->
    json = JSON.parse(fs.readFileSync(particle.libPath, 'utf8'))
    $scope.refresh(json.particle)

  eng = EngineHolder.get().engine
  if eng?
    eng.appendDom()
    eng.initScene(particlePlaygroundScene, $scope.jsonInput, false)
    $scope.refresh()
    setTimeout =>
      $scope.refresh()
    , 1000

  $scope.$watch 'options.clearColor', (newValue, oldValue) ->
    engine.renderer.setClearColor(newValue)

  $scope.toggleStats = ->
    config.toggleStats()
