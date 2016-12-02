THREE.ShaderLib['dissolve'] =
  vertexShader: [
    "varying vec2 vUv;"
    "uniform float morphTargetInfluences[ 8 ];"

    "void main() {"

    "  vUv = uv;"

    "  vec3 morphed = vec3( 0.0 );"
    "  morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];"
    "  morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];"
    "  morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];"
    "  morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];"

    "  morphed += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];"
    "  morphed += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];"
    "  morphed += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];"
    "  morphed += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];"

    "  morphed += position;"

    "  vec4 mvPosition;"

    "  mvPosition = modelViewMatrix * vec4( morphed, 1.0 );"

    "  gl_Position = projectionMatrix * mvPosition;"

    "  //vec4 worldPosition = modelMatrix * vec4( morphed, 1.0 );"
    "}"
  ].join("\n")

  fragmentShader: [
    "varying vec2 vUv;"
    "uniform sampler2D texture;"
    "uniform sampler2D noise;"

    "uniform float dissolve;"

    "void main()"
    "{"
    "  vec4 color = texture2D( texture, vUv );"
    "  float n = texture2D( noise, vUv ).x;"
    "  n = ( n - dissolve ) * 50.0;"
    "  if (n < 0.0) {"
    "    discard;"
    "  }"
    "  if (n < 1.0) {"
    "    color.r = 1.0; color.g = 0.5; color.b = 0.0;"
    "  }"
    "  gl_FragColor = color;"
    "}"
  ].join("\n")
