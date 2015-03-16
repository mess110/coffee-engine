module.exports = (grunt) ->
  files_3d = [
    "bower_components/stats.js/src/Stats.js"
    "bower_components/tweenjs/src/Tween.js"
    "bower_components/threex.windowresize/threex.windowresize.js"
    "bower_components/threex.rendererstats/threex.rendererstats.js"
    "bower_components/threejs/build/three.js"

    "src/shared/SceneManager.js"
    "src/shared/NetworkManager.js"
    "src/shared/StatsManager.js"
    "src/shared/SoundManager.js"
    "src/shared/EngineUtils.js"

    "src/vendor/AnaglyphEffect.js"

    # This NEEDS to be in this position
    "src/3d/Hack.js"

    "src/3d/ResourceManager.js"
    "src/3d/BaseScene.js"
    "src/3d/BaseModel.js"
    "src/3d/Config.js"
    "src/3d/Engine3D.js"
  ]

  files_2d = [
    "src/shared/SceneManager.js"

    "src/2d/Utils.js"
    "src/2d/BaseScene.js"
    "src/2d/Engine2D.js"
  ]

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    shell:
      "compile-coffee-watch":
        command: "coffee --output . -b -c -w ."
      "compile-coffee":
        command: "coffee --output . -b -c ."

    uglify:
      engine_min:
        options:
          mangle: false
          beautify: false
        files: [
          "build/coffee-engine-3d.min.js": files_3d
          "build/coffee-engine-2d.min.js": files_2d
        ]
      engine:
        options:
          mangle: false
          beautify: true
        files: [
          "build/coffee-engine-3d.js": files_3d
          "build/coffee-engine-2d.js": files_2d
        ]

  grunt.registerTask "compile:coffee:watch", ["shell:compile-coffee-watch"]
  grunt.registerTask "compile:coffee", ["shell:compile-coffee"]

  grunt.registerTask "release", ["compile:coffee", "uglify:engine", "uglify:engine_min"]
  grunt.registerTask "dev", ["compile:coffee:watch"]

  grunt.registerTask "default", ["dev"]

  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
