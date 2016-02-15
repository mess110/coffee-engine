module.exports = (grunt) ->
  files_3d = [
    "bower_components/stats.js/src/Stats.js"
    "bower_components/tweenjs/src/Tween.js"

    "bower_components/threejs/build/three.js"

    "bower_components/threejs/examples/js/effects/AnaglyphEffect.js"
    "bower_components/threejs/examples/js/controls/OrbitControls.js"
    "bower_components/threejs/examples/js/Mirror.js"

    "bower_components/threex.windowresize/threex.windowresize.js"
    "bower_components/threex.rendererstats/threex.rendererstats.js"
    "bower_components/threex.universalloader/threex.universalloader.js"
    "bower_components/threex.keyboardstate/threex.keyboardstate.js"
    "bower_components/threex.volumetricspotlight/threex.volumetricspotlightmaterial.js"
    "bower_components/ocean/water-material.js"
    "bower_components/ShaderParticleEngine/build/ShaderParticles.js"
    "bower_components/threex.dynamictexture/threex.dynamictexture.js"

    # This NEEDS to be in this position
    "src/3d/Hack.js"

    "src/shared/SceneManager.js"
    "src/shared/NetworkManager.js"
    "src/shared/StatsManager.js"
    "src/shared/SoundManager.js"
    "src/shared/Persist.js"
    "src/shared/Utils.js"

    "src/3d/JsonModelManager.js"
    "src/3d/TextureManager.js"
    "src/3d/BaseScene.js"
    "src/3d/BaseModel.js"
    "src/3d/BaseParticle.js"
    "src/3d/Config.js"
    "src/3d/Helper.js"

    "src/3d/extra/Water.js"
    "src/3d/extra/Terrain.js"
    "src/3d/extra/SpotLight.js"
    "src/3d/extra/Mirror.js"
    "src/3d/extra/LoadingScene.js"

    "src/3d/Engine3D.js"
  ]

  files_2d = [
    "bower_components/stats.js/src/Stats.js"
    "bower_components/tweenjs/src/Tween.js"

    "src/shared/SceneManager.js"
    "src/shared/Persist.js"
    "src/shared/Utils.js"

    "src/2d/BaseScene.js"
    "src/2d/BaseModel.js"
    "src/2d/Engine2D.js"
  ]

  extras = [
    "src/shared/SyntaxSugar.js"
  ]

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    shell:
      "compile-coffee-watch":
        command: "coffee --output . -b -c -w ."
      "compile-coffee":
        command: "coffee --output . -b -c ."
      "doc-3d":
        command: "./node_modules/.bin/codo -u -o ./doc/3d/ -r README_3D.md src/3d/ src/shared/"
      "doc-2d":
        command: "./node_modules/.bin/codo -u -o ./doc/2d/ -r README_2D.md src/2d/ src/shared/"
      "tools":
        command: "npm run start"

    uglify:
      engine:
        options:
          mangle: false
          beautify: true
        files: [
          "build/coffee-engine-2d.js": files_2d.concat(extras)
          "build/coffee-engine-3d.js": files_3d.concat(extras)
        ]

  grunt.registerTask "compile:coffee:watch", ["shell:compile-coffee-watch"]
  grunt.registerTask "compile:coffee", ["shell:compile-coffee"]

  grunt.registerTask "build", ["compile:coffee", "uglify:engine"]
  grunt.registerTask "dev", ["compile:coffee:watch"]

  grunt.registerTask "doc", ["shell:doc-3d", "shell:doc-2d"]
  grunt.registerTask "tools", ["shell:tools"]

  grunt.registerTask "default", ["dev"]

  require('load-grunt-tasks')(grunt)
