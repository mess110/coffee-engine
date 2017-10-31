class PhysicsTerrain extends BaseModel
  constructor: (physicsWorld) ->
    super()

    @physicsWorld = physicsWorld

    @feelScale = 2

    @terrainWidthExtents = 100
    @terrainDepthExtents = 100
    @terrainWidth = 128
    @terrainDepth = 128
    @terrainHalfWidth = @terrainWidth / 2
    @terrainHalfDepth = @terrainDepth / 2
    @terrainMaxHeight = 8
    @terrainMinHeight = -2

    @heightData = @generateHeight( @terrainWidth, @terrainDepth, @terrainMinHeight, @terrainMaxHeight )

    groundShape = @createTerrainShape(@heightData)
    groundTransform = new (Ammo.btTransform)
    groundTransform.setIdentity()

    groundTransform.setOrigin new (Ammo.btVector3)(0, (@terrainMaxHeight + @terrainMinHeight) / 2, 0)
    groundMass = 0
    groundLocalInertia = new (Ammo.btVector3)(0, 0, 0)
    groundMotionState = new (Ammo.btDefaultMotionState)(groundTransform)
    groundBody = new (Ammo.btRigidBody)(new (Ammo.btRigidBodyConstructionInfo)(groundMass, groundMotionState, groundShape, groundLocalInertia))
    physicsWorld.addRigidBody groundBody


    geometry = new (THREE.PlaneBufferGeometry)(@terrainWidth * @feelScale, @terrainDepth * @feelScale, @terrainWidth - 1, @terrainDepth - 1)
    geometry.rotateX -Math.PI / 2
    vertices = geometry.attributes.position.array
    i = 0
    j = 0
    l = vertices.length
    while i < l
      # j + 1 because it is the y component that we modify
      vertices[j + 1] = @heightData[i]
      i++
      j += 3
    geometry.computeVertexNormals()
    groundMaterial = new (THREE.MeshPhongMaterial)(color: 0xC7C7C7)
    @mesh = new (THREE.Mesh)(geometry, groundMaterial)
    # @mesh.scale.y = 1.5

  generateHeight: (width, depth, minHeight, maxHeight) ->
    hm = TextureManager.item('track01')
    data = Terrain.getHeightData(hm.image, 10)
    data = data.map (e) -> e
    data

  createTerrainShape: ->
    # This parameter is not really used, since we are using PHY_FLOAT height data type and hence it is ignored
    heightScale = 1
    # Up axis = 0 for X, 1 for Y, 2 for Z. Normally 1 = Y is used.
    upAxis = 1
    # hdt, height data type. "PHY_FLOAT" is used. Possible values are "PHY_FLOAT", "PHY_UCHAR", "PHY_SHORT"
    hdt = 'PHY_FLOAT'
    hdt = 'PHY_UCHAR'
    # Set this to your needs (inverts the triangles)
    flipQuadEdges = false
    # Creates height data buffer in Ammo heap
    ammoHeightData = Ammo._malloc(4 * @terrainWidth * @terrainDepth)
    # Copy the javascript height data array to the Ammo one.
    p = 0
    p2 = 0
    j = 0
    while j < @terrainDepth
      i = 0
      while i < @terrainWidth
        # write 32-bit float data to memory
        Ammo.HEAPF32[ammoHeightData + p2 >> 2] = @heightData[p]
        p++
        # 4 bytes/float
        p2 += 4
        i++
      j++
    # Creates the heightfield physics shape
    heightFieldShape = new (Ammo.btHeightfieldTerrainShape)(@terrainWidth, @terrainDepth, ammoHeightData, heightScale, @terrainMinHeight, @terrainMaxHeight, upAxis, hdt, flipQuadEdges)
    # Set horizontal scale
    scaleX = @terrainWidthExtents / (@terrainWidth - 1)
    scaleZ = @terrainDepthExtents / (@terrainDepth - 1)
    heightFieldShape.setLocalScaling new (Ammo.btVector3)(@feelScale, 1, @feelScale)
    # heightFieldShape.setMargin 0.05
    heightFieldShape
