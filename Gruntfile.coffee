module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    shell:
      "compile-coffee-watch":
        command: "coffee --output . -b -c -w ."
      "compile-coffee":
        command: "coffee --output . -b -c ."

    uglify:
      options:
        mangle: false
        beautify: false
      engines:
        files: [
          "build/coffee-engine-3d.min.js": [
            "src/shared/SceneManager.js"
            "src/shared/NetworkManager.js"
            "src/shared/StatsManager.js"
            "src/shared/SoundManager.js"

            "src/3d/ResourceManager.js"
            "src/3d/BaseScene.js"
            "src/3d/BaseModel.js"
            "src/3d/EngineUtils.js"
            "src/3d/Config.js"
            "src/3d/Engine3D.js"
          ]

          "build/coffee-engine-2d.min.js": [
            "src/shared/SceneManager.js"

            "src/2d/Utils.js"
            "src/2d/BaseScene.js"
            "src/2d/Engine2D.js"
          ]
        ]

  grunt.registerTask "compile:coffee:watch", ["shell:compile-coffee-watch"]
  grunt.registerTask "compile:coffee", ["shell:compile-coffee"]

  grunt.registerTask "release", ["compile:coffee", "uglify:engines"]
  grunt.registerTask "dev", ["compile:coffee:watch"]

  grunt.registerTask "default", ["dev"]

  grunt.loadNpmTasks 'grunt-shell'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
