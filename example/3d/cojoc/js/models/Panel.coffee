class Panel extends BaseModel
  tm: TextureManager.get()

  constructor: (options = {})->
    throw 'options.key missing' unless options.key?
    options.material = new THREE.MeshBasicMaterial(map: @tm.items[options.key], transparent: true)
    options.material.map.minFilter = THREE.LinearFilter
    @mesh = Helper.plane(options)
