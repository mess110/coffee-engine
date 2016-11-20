coffee-engine
=============

A collection of pre-bundled libraries and a basic game architecture to jump start
your development.

* 3d engine ~ thin layer over three.js in coffeescript
* 2d engine (WIP)
* server ~ using socket.io
  * tick rate
  * example for:
    * client side prediction
    * server reconciliation
    * entity interpolication
* tools
  - model-viewer
  - particle-playground
  - terrain-generator
  - bezier-editor
  - shader-editor
  - game-maker
* examples

3D
--

To get started with the 3D engine, read the docs. They are automatically generated
after npm install in the doc folder.

You can also find more information in README_3D.md

The 3D engine uses:

* Tween.js
* Three.js
* ThreeX
* Water Material
* ShaderParticleEngine
* Stats.js

tools
-----

```
npm start
```
A nw.js desktop app which allows you to:

* create games
* view models and animations from json models exported for three.js
* play with particles
* visualize heightmap terrains
* use a shader editor
* overlay assets
* draw curved lines

The models I am using are created in blender and exported with the official
three.js blender plugin.

examples
--------

All examples are in the example/ folder.

commands
--------

```
grunt dev
```

```
grunt doc
```

```
grunt build # compiles files for release
```

```
./release.rb # requires ruby
```
