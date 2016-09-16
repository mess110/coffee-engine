fs = require('fs')

module.exports = (grunt) ->
  files_3d = [
    "bower_components/stats.js/src/Stats.js"
    "bower_components/tweenjs/src/Tween.js"

    "bower_components/threejs/build/three.js"

    "bower_components/threejs/examples/js/effects/StereoEffect.js"
    "bower_components/threejs/examples/js/effects/AnaglyphEffect.js"
    "bower_components/threejs/examples/js/controls/OrbitControls.js"
    # "bower_components/threejs/examples/js/controls/DeviceOrientationControls.js"
    "bower_components/threejs/examples/js/controls/FirstPersonControls.js"
    "bower_components/threejs/examples/js/controls/PointerLockControls.js"
    "bower_components/threejs/examples/js/Mirror.js"

    "bower_components/threex.windowresize/threex.windowresize.js"
    "bower_components/threex.rendererstats/threex.rendererstats.js"
    "bower_components/threex.universalloader/threex.universalloader.js"
    "bower_components/threex.keyboardstate/threex.keyboardstate.js"
    "bower_components/threex.volumetricspotlight/threex.volumetricspotlightmaterial.js"
    "bower_components/ocean/water-material.js"
    "bower_components/ShaderParticleEngine/build/ShaderParticles.js"
    "src/vendor/threex.dynamictexture.js"
    "src/vendor/DeviceOrientationControls.js"

    "bower_components/file-saver/FileSaver.js"
    "bower_components/virtualjoystick.js/virtualjoystick.js"

    # This NEEDS to be in this position
    "src/3d/Hack.js"

    "src/shared/SceneManager.js"
    "src/shared/NetworkManager.js"
    "src/shared/StatsManager.js"
    "src/shared/SoundManager.js"
    "src/shared/SaveObjectManager.js"
    "src/shared/HighScoreManager.js"
    "src/shared/Persist.js"
    "src/shared/Utils.js"
    "src/shared/VirtualController.js"

    "src/3d/JsonModelManager.js"
    "src/3d/TextureManager.js"
    "src/3d/MaterialManager.js"
    "src/3d/BaseScene.js"
    "src/3d/BaseModel.js"
    "src/3d/BaseControls.js"
    "src/3d/BaseParticle.js"
    "src/3d/Config.js"
    "src/3d/Helper.js"

    "src/3d/extra/Terrain.js"
    "src/3d/extra/SpotLight.js"
    "src/3d/extra/Mirror.js"
    "src/3d/extra/LookAtTimer.js"
    "src/3d/extra/LoadingScene.js"
    "src/3d/extra/Cinematic.js"
    "src/3d/extra/CinematicScene.js"
    "src/3d/extra/ArtGenerator.js"
    "src/3d/extra/Modifiers.js"
    "src/3d/extra/VRControls.js"
    "src/3d/extra/Walker.js"
    "src/3d/extra/Water.js"

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
    "src/shared/EngineHolder.js"
    "bower_components/howler.js/howler.js"
    "bower_components/socket.io-client/dist/socket.io.js"
    "src/vendor/drawBezier.js"
    "src/vendor/jnorthpole.js"
  ]

  all_2d_files = files_2d.concat(extras)
  all_3d_files = files_3d.concat(extras)

  for file in all_3d_files.concat(all_2d_files)
    unless fs.existsSync(file)
      throw "ERROR: #{file} does not exist!"

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
      "doc-server":
        command: "./node_modules/.bin/codo -u -o ./doc/server/ -r README_SERVER.md src/server/ src/shared/Utils.coffee"
      "engine":
        command: "npm run start"
      "server":
        command: "./node_modules/.bin/http-server"
      "update":
        command: "git stash && git pull && git stash pop"
      "new":
        command: ->
          output = grunt.option('output')
          template = grunt.option('template')

          if !output? and !template?
            'echo "\nExample usage:\n\n  grunt new --template=3d/project --output=foo"'
          else if !output?
            'echo "\noutput argument missing.\nIt is the name of your project.\nA new folder will be created."'
          else if !template?
            [
              'echo'
              'echo "Example:"'
              'echo'
              'echo "  grunt new --template 3d/project"'
              'echo'
              'echo "Templates:"'
              'echo'
              'echo 2d:'
              'echo `ls example/2d/`'
              'echo'
              'echo 3d:'
              'echo `ls example/3d/`'
            ].join(' && ')
          else
            [
              "cp -a example/#{template} #{output}"
              'echo'
              "echo Game created in #{output}."
              'echo To view a list of coffee-engine commands run in the project folder.'
              'echo'
              'echo "  npm run"'
            ].join(' && ')

    uglify:
      engine:
        options:
          mangle: false
          beautify: true
        files: [
          "build/coffee-engine-2d.js": all_2d_files
          "build/coffee-engine-3d.js": all_3d_files
        ]

  grunt.registerTask "compile:coffee:watch", ["shell:compile-coffee-watch"]
  grunt.registerTask "compile:coffee", ["shell:compile-coffee"]

  grunt.registerTask "build", ["compile:coffee", "uglify:engine"]
  grunt.registerTask "dev", ["compile:coffee:watch"]

  grunt.registerTask "new", ["shell:new"]

  grunt.registerTask "doc", ["shell:doc-3d", "shell:doc-2d", "shell:doc-server"]
  grunt.registerTask "engine", ["shell:engine"]
  grunt.registerTask "server", ["shell:server"]

  grunt.registerTask "default", ["dev"]

  require('load-grunt-tasks')(grunt)
