# Uses THREEx.VolumetricSpotLightMaterial to create a spotlight effect
#
# @example
#   spotLight = new SpotLight(0, 10, 0)
#   spotLight.addToScene(scene)
#
class SpotLight extends BaseModel
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

  # A helper which aims to make it easy to add spotlights and related
  # objects to the scene
  addToScene: (scene) ->
    scene.add @mesh
    scene.add @spotLight
    scene.add @spotLight.target
