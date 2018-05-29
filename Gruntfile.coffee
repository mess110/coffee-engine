fs = require('fs')

module.exports = (grunt) ->
  files_3d = [
    "node_modules/stats.js/src/Stats.js"
    "node_modules/tween.js/src/Tween.js"
    "node_modules/ccapture.js/build/CCapture.all.min.js"

    "node_modules/three/build/three.js"

    "node_modules/three/examples/js/effects/StereoEffect.js"
    "node_modules/three/examples/js/effects/AnaglyphEffect.js"
    "node_modules/three/examples/js/controls/OrbitControls.js"
    "node_modules/three/examples/js/controls/FirstPersonControls.js"
    "node_modules/three/examples/js/controls/PointerLockControls.js"
    "node_modules/three/examples/js/Mirror.js"
    "node_modules/three/examples/js/Detector.js"

    "src/vendor/threex.windowresize.js"
    "src/vendor/threex.rendererstats.js"
    "src/vendor/threex.universalloader.js"
    "src/vendor/threex.keyboardstate.js"
    "src/vendor/threex.volumetricspotlightmaterial.js"
    "src/vendor/threex.basiclighting.js"
    "node_modules/three.terrain.js/build/THREE.Terrain.min.js"
    "src/vendor/water-material.js"
    "node_modules/shader-particle-engine/build/SPE.js"
    "src/vendor/threex.dynamictexture.js"
    "src/vendor/DeviceOrientationControls.js"


    "node_modules/three/examples/js/shaders/ConvolutionShader.js"
    "node_modules/three/examples/js/shaders/CopyShader.js"
    "node_modules/three/examples/js/shaders/FXAAShader.js"
    "node_modules/three/examples/js/shaders/FilmShader.js"
    "node_modules/three/examples/js/shaders/BokehShader.js"
    "node_modules/three/examples/js/shaders/DigitalGlitch.js"
    "node_modules/three/examples/js/shaders/LuminosityHighPassShader.js"

    "node_modules/three/examples/js/postprocessing/EffectComposer.js"
    "node_modules/three/examples/js/postprocessing/MaskPass.js"
    "node_modules/three/examples/js/postprocessing/RenderPass.js"
    "node_modules/three/examples/js/postprocessing/ShaderPass.js"
    "node_modules/three/examples/js/postprocessing/BloomPass.js"
    "node_modules/three/examples/js/postprocessing/FilmPass.js"
    "node_modules/three/examples/js/postprocessing/BokehPass.js"
    "node_modules/three/examples/js/postprocessing/GlitchPass.js"
    "node_modules/three/examples/js/postprocessing/UnrealBloomPass.js"
    "node_modules/three/examples/js/postprocessing/OutlinePass.js"

    # "node_modules/ammo.js/builds/ammo.js"

    "node_modules/file-saver/FileSaver.js"
    "src/vendor/virtualjoystick.js"

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
    "src/shared/VideoRecorderManager.js"
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
    "src/3d/ShaderLib.js"
    "src/3d/PoolManager.js"
    "src/3d/PolyfillRenderer.js"

    "src/3d/extra/AfterEffects.js"
    "src/3d/extra/ArtGenerator.js"
    "src/3d/extra/BaseText.js"
    "src/3d/extra/Cinematic.js"
    "src/3d/extra/CinematicScene.js"
    "src/3d/extra/LightningBolt.js"
    "src/3d/extra/LoadingScene.js"
    "src/3d/extra/LookAtTimer.js"
    "src/3d/extra/Mirror.js"
    "src/3d/extra/Modifiers.js"
    "src/3d/extra/SpotLight.js"
    "src/3d/extra/Terrain.js"
    "src/3d/extra/Tree.js"
    "src/3d/extra/VRControls.js"
    "src/3d/extra/Walker.js"
    "src/3d/extra/Water.js"

    "src/3d/Engine3D.js"
  ]

  files_2d = [
    "node_modules/stats.js/src/Stats.js"
    "node_modules/tween.js/src/Tween.js"

    "src/3d/Hack.js"

    "src/shared/SceneManager.js"
    "src/shared/Persist.js"
    "src/shared/Utils.js"

    "src/2d/BaseScene.js"
    "src/2d/BaseModel.js"
    "src/2d/Engine2D.js"
  ]

  extras = [
    "src/shared/SyntaxSugar.js"
    "src/shared/Hodler.js"
    "node_modules/howler/howler.js"
    # "node_modules/socket.io-client/dist/socket.io.js"
    "src/vendor/drawBezier.js"
    "src/vendor/jnorthpole.js"

    "src/server/GameInstance.js"
  ]

  all_2d_files = files_2d.concat(extras)
  all_3d_files = files_3d.concat(extras)

  for file in all_3d_files.concat(all_2d_files)
    unless fs.existsSync(file)
      throw "ERROR: #{file} does not exist!"

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")
    shell:
      "compile-coffee-src-watch":
        command: "./node_modules/.bin/coffee --output src/ -b -c -w src/"
      "compile-coffee-src":
        command: "./node_modules/.bin/coffee --output src/ -b -c src/"

      "compile-coffee-tools-watch":
        command: "./node_modules/.bin/coffee --output tools/ -b -c -w tools/"
      "compile-coffee-tools":
        command: "./node_modules/.bin/coffee --output tools/ -b -c tools/"

      "compile-coffee-example-watch":
        command: "./node_modules/.bin/coffee --output example/ -b -w -c example/"
      "compile-coffee-example":
        command: "./node_modules/.bin/coffee --output example/ -b -c example/"

      "doc-3d":
        command: "./node_modules/.bin/codo -u -o ./doc/3d/ -r README_3D.md src/3d/ src/shared/"
      "doc-2d":
        command: "./node_modules/.bin/codo -u -o ./doc/2d/ -r README_2D.md src/2d/ src/shared/"
      "doc-server":
        command: "./node_modules/.bin/codo -u -o ./doc/server/ -r README_SERVER.md src/server/ src/shared/Utils.coffee"
      "engine":
        command: "npm run start"
      "server":
        command: "./node_modules/.bin/http-server -g -c-1"
      "update":
        command: "git stash && git pull && git stash pop"
      "help":
        command: ->
          [
            'echo'
            'echo "grunt compile-coffee"'
            'echo'
            'echo "grunt shell:compile-coffee-src-watch"'
            'echo "grunt shell:compile-coffee-tools-watch"'
            'echo "grunt shell:compile-coffee-example-watch"'
          ].join(' && ')
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

  # grunt.registerTask "compile:coffee:toolchain", ["shell:compile-coffee-src", "shell:compile-coffee-tools"]
  # grunt.registerTask "compile:coffee:src", ["shell:compile-coffee-src-watch"]
  # grunt.registerTask "compile:coffee:example", ["shell:compile-coffee-example-watch"]

  grunt.registerTask "compile-coffee", ["shell:compile-coffee-src", "shell:compile-coffee-tools", "shell:compile-coffee-example"]
  grunt.registerTask "build", ["compile-coffee", "uglify:engine"]

  grunt.registerTask "new", ["shell:new"]

  grunt.registerTask "doc", ["shell:doc-3d", "shell:doc-2d", "shell:doc-server"]
  grunt.registerTask "engine", ["shell:engine"]
  grunt.registerTask "server", ["shell:server"]

  grunt.registerTask "help", ["shell:help"]

  grunt.registerTask "default", ["help"]

  require('load-grunt-tasks')(grunt)
