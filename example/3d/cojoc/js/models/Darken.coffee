class Darken extends BaseModel
  constructor: ->
    super()

    size = 50
    @material = new THREE.MeshBasicMaterial({
      transparent: true,
      color: "#000"
    })
    @material.depthWrite = false
    @mesh = Helper.plane(material: @material, width: size, height: size)

    @setOpacity(1)

  fade: (dest) ->
    if @tween?
      @tween.stop()
    @tween = FadeModifier(@, @mesh.material.opacity, dest, 2000)
