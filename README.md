coffee-engine
=============

A collection of pre-bundled libraries and a basic game architecture to jump start
your game development.

The 3D engine uses:

* Tween.js
* Three.js
* ThreeX
* Water Material
* ShaderParticleEngine
* Stats.js

It also comes with some tools

* JSON model viewer
* particle engine editor

* 3d engine ~ thin layer over three.js in coffeescript
* 2d engine (WIP)
* tools
  - model-viewer
  - particle-editor
  - terrain-generator

3D
--

To get started with the 3D engine, read the docs. They are automatically generated
after npm install in the doc folder.

You can also find more information in README_3D.md

tools
-----

```
npm start
```
A nw.js desktop app which allows you to:

* view models and animations from json models exported for three.js
* play with particles
* visualize heightmap terrains

The models I am using are created in blender and exported with the official
three.js blender plugin.

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
