class SpotLight
  constructor: (x, y, z)->
    geometry = new (THREE.CylinderGeometry)(0.1, 2.5, 5, 32 * 2, 40, true)
    geometry.applyMatrix (new (THREE.Matrix4)).makeTranslation(0, -geometry.parameters.height / 2, 0)
    geometry.applyMatrix (new (THREE.Matrix4)).makeRotationX(-Math.PI / 2)
    @material = new (THREEx.VolumetricSpotLightMaterial)
    @mesh = new (THREE.Mesh)(geometry, @material)
    @mesh.position.set x, y, z
    @mesh.lookAt new (THREE.Vector3)(0, 0, 0)
    @material.uniforms.lightColor.value.set 'white'
    @material.uniforms.spotPosition.value = @mesh.position

    @spotLight = new (THREE.SpotLight)
    @spotLight.position.copy @mesh.position
    @spotLight.color = @mesh.material.uniforms.lightColor.value
    @spotLight.exponent = 30
    @spotLight.angle = Math.PI / 3
    @spotLight.intensity = 3

    @spotLight.castShadow = true
    @spotLight.shadowCameraNear = 0.01
    @spotLight.shadowCameraFar = 100
    @spotLight.shadowCameraFov = 45
    @spotLight.shadowCameraLeft = -8
    @spotLight.shadowCameraRight = 8
    @spotLight.shadowCameraTop = 8
    @spotLight.shadowCameraBottom = -8
    # @spotLight.shadowCameraVisible = true
    @spotLight.shadowBias = 0.0
    @spotLight.shadowDarkness = 0.5
    @spotLight.shadowMapWidth = 1024
    @spotLight.shadowMapHeight = 1024

    @direction = new (THREE.Vector3)(0,0,0)
    @lastDir = 0

  lookAt: (node) ->
    target = node.position
    @mesh.lookAt target
    @spotLight.target.position.copy target
    # @spotLight.target.position.y = 1

class LightCtrl
  constructor: ->
    @spotLight1 = new SpotLight(-5, 30, 25)

    @spotLight2 = new SpotLight(0, 30, 25)

    @spotLight3 = new SpotLight(5, 30, 25)

  addAllToScene: (scene) ->
    # scene.add @spotLight1.mesh
    # scene.add @spotLight1.spotLight
    # scene.add @spotLight1.spotLight.target
    scene.add @spotLight2.mesh
    scene.add @spotLight2.spotLight
    scene.add @spotLight2.spotLight.target
    # scene.add @spotLight3.mesh
    # scene.add @spotLight3.spotLight
    # scene.add @spotLight3.spotLight.target

  lookAt: (node) ->
    # @spotLight1.lookAt(node)
    @spotLight2.lookAt(node)
    # @spotLight3.lookAt(node)

  randomize: (tpf) ->
    # @_foo(@spotLight1, tpf)
    @_foo(@spotLight2, tpf)
    # @_foo(@spotLight3, tpf)

  _foo: (spotLight, tpf) ->
    spotLight.lastDir += tpf
    if spotLight.lastDir > 1
      spotLight.lastDir = 0
      rX = (Math.random() - 0.5)
      rZ = (Math.random() - 0.5)

      asd = spotLight.spotLight.target.position
      if asd.x < -5
        rX = 0.1
      if asd.x > 5
        rX = -0.1
      if asd.z < -5
        rZ = 0.1
      if asd.z > 5
        rZ = -0.1

      spotLight.direction.set rX, 0, rZ

    pp =  spotLight.spotLight.target.position
    p =
      x: pp.x
      y: pp.y
      z: pp.z
    p.x += spotLight.direction.x
    p.y += spotLight.direction.z

    spotLight.lookAt(
      position: p
    )
