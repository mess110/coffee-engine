# Uses THREEx.VolumetricSpotLightMaterial to create a spotlight effect
#
# @example
#   spotLight = new SpotLight(0, 10, 0)
#   spotLight.addToScene(scene)
#   spotLight.lookAt(new (THREE.Vector3)(0, 0, 0))
#
# @see https://github.com/jeromeetienne/threex.volumetricspotlight
class SpotLight extends BaseModel
  # Creates a new spotlight
  #
  # @param [Number] x - start z position
  # @param [Number] y - start y position
  # @param [Number] z - start x position
  constructor: (x, y, z)->
    geometry = new (THREE.CylinderGeometry)(0.1, 2.5, 5, 32 * 2, 40, true)
    geometry.applyMatrix (new (THREE.Matrix4)).makeTranslation(0, -geometry.parameters.height / 2, 0)
    geometry.applyMatrix (new (THREE.Matrix4)).makeRotationX(-Math.PI / 2)
    @material = new (THREEx.VolumetricSpotLightMaterial)
    @mesh = new (THREE.Mesh)(geometry, @material)
    @mesh.position.set x, y, z
    @mesh.lookAt new (THREE.Vector3)(0, 0, 0)
    @setColor('white')
    @material.uniforms.spotPosition.value = @mesh.position

    @spotLight = new (THREE.SpotLight)
    @spotLight.position.copy @mesh.position
    @spotLight.color = @mesh.material.uniforms.lightColor.value
    @spotLight.exponent = 30
    @spotLight.angle = Math.PI / 3
    @spotLight.intensity = 3

    @spotLight.castShadow = true
    @spotLight.shadow.camera.near = 0.01
    @spotLight.shadow.camera.far = 100
    @spotLight.shadow.camera.fov = 45
    @spotLight.shadow.camera.left = -8
    @spotLight.shadow.camera.right = 8
    @spotLight.shadow.camera.top = 8
    @spotLight.shadow.camera.bottom = -8
    # @spotLight.shadow.camera.visible = true
    @spotLight.shadow.bias = 0.1
    @spotLight.shadow.darkness = 0.5
    @spotLight.shadow.mapSize.width = 1024
    @spotLight.shadow.mapSize.height = 1024

    @direction = new (THREE.Vector3)(0,0,0)
    @lastDir = 0

  # Make the spotlight look at a node's position
  #
  # @param [Object] node
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

  # Sets the spotlight color
  #
  # @param [String] color
  #
  # @example
  #
  #   spotLight.setColor('white')
  #   spotLight.setColor('#ffffff')
  setColor: (color) ->
    @material.uniforms.lightColor.value.set color
