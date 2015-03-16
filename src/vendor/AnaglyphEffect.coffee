###
@author mrdoob / http://mrdoob.com/
@author marklundin / http://mark-lundin.com/
@author alteredq / http://alteredqualia.com/
###
THREE.AnaglyphEffect = (renderer, width, height) ->
  eyeRight = new THREE.Matrix4()
  eyeLeft = new THREE.Matrix4()
  distanceBetweenGlyhs = 30
  focalLength = 125
  _aspect = undefined
  _near = undefined
  _far = undefined
  _fov = undefined
  _cameraL = new THREE.PerspectiveCamera()
  _cameraL.matrixAutoUpdate = false
  _cameraR = new THREE.PerspectiveCamera()
  _cameraR.matrixAutoUpdate = false
  _camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  _scene = new THREE.Scene()
  _params =
    minFilter: THREE.LinearFilter
    magFilter: THREE.NearestFilter
    format: THREE.RGBAFormat

  width = 512  if width is `undefined`
  height = 512  if height is `undefined`
  _renderTargetL = new THREE.WebGLRenderTarget(width, height, _params)
  _renderTargetR = new THREE.WebGLRenderTarget(width, height, _params)
  _material = new THREE.ShaderMaterial(
    uniforms:
      mapLeft:
        type: "t"
        value: _renderTargetL

      mapRight:
        type: "t"
        value: _renderTargetR

    vertexShader: [
      "varying vec2 vUv;"
      "void main() {"
      "\tvUv = vec2( uv.x, uv.y );"
      "\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );"
      "}"
    ].join("\n")
    
    # http://3dtv.at/Knowhow/AnaglyphComparison_en.aspx
    fragmentShader: [
      "uniform sampler2D mapLeft;"
      "uniform sampler2D mapRight;"
      "varying vec2 vUv;"
      "void main() {"
      "\tvec4 colorL, colorR;"
      "\tvec2 uv = vUv;"
      "\tcolorL = texture2D( mapLeft, uv );"
      "\tcolorR = texture2D( mapRight, uv );"
      "\tgl_FragColor = vec4( colorL.g * 0.7 + colorL.b * 0.3, colorR.g, colorR.b, colorL.a + colorR.a ) * 1.1;"
      "}"
    ].join("\n")
  )
  mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), _material)
  _scene.add mesh

  @setSize = (width, height) ->
    _renderTargetL = new THREE.WebGLRenderTarget(width, height, _params)
    _renderTargetR = new THREE.WebGLRenderTarget(width, height, _params)
    _material.uniforms["mapLeft"].value = _renderTargetL
    _material.uniforms["mapRight"].value = _renderTargetR
    renderer.setSize width, height

  @setDistanceBetweenGlyphs = (dist) ->
    distanceBetweenGlyhs = dist


  #
  #	 * Renderer now uses an asymmetric perspective projection
  #	 * (http://paulbourke.net/miscellaneous/stereographics/stereorender/).
  #	 *
  #	 * Each camera is offset by the eye seperation and its projection matrix is
  #	 * also skewed asymetrically back to converge on the same projection plane.
  #	 * Added a focal length parameter to, this is where the parallax is equal to 0.
  #	 
  @render = (scene, camera) ->
    scene.updateMatrixWorld()
    camera.updateMatrixWorld()  if camera.parent is `undefined`
    hasCameraChanged = (_aspect isnt camera.aspect) or (_near isnt camera.near) or (_far isnt camera.far) or (_fov isnt camera.fov)
    if hasCameraChanged
      _aspect = camera.aspect
      _near = camera.near
      _far = camera.far
      _fov = camera.fov
      projectionMatrix = camera.projectionMatrix.clone()
      eyeSep = focalLength / distanceBetweenGlyhs * 0.5
      eyeSepOnProjection = eyeSep * _near / focalLength
      ymax = _near * Math.tan(THREE.Math.degToRad(_fov * 0.5))
      xmin = undefined
      xmax = undefined
      
      # translate xOffset
      eyeRight.elements[12] = eyeSep
      eyeLeft.elements[12] = -eyeSep
      
      # for left eye
      xmin = -ymax * _aspect + eyeSepOnProjection
      xmax = ymax * _aspect + eyeSepOnProjection
      projectionMatrix.elements[0] = 2 * _near / (xmax - xmin)
      projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin)
      _cameraL.projectionMatrix.copy projectionMatrix
      
      # for right eye
      xmin = -ymax * _aspect - eyeSepOnProjection
      xmax = ymax * _aspect - eyeSepOnProjection
      projectionMatrix.elements[0] = 2 * _near / (xmax - xmin)
      projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin)
      _cameraR.projectionMatrix.copy projectionMatrix
    _cameraL.matrixWorld.copy(camera.matrixWorld).multiply eyeLeft
    _cameraL.position.copy camera.position
    _cameraL.near = camera.near
    _cameraL.far = camera.far
    renderer.render scene, _cameraL, _renderTargetL, true
    _cameraR.matrixWorld.copy(camera.matrixWorld).multiply eyeRight
    _cameraR.position.copy camera.position
    _cameraR.near = camera.near
    _cameraR.far = camera.far
    renderer.render scene, _cameraR, _renderTargetR, true
    renderer.render _scene, _camera
    return

  return
