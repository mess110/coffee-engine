coffee-engine
=============

* 3d engine ~ thin layer over three.js in coffeescript
* 2d engine
* 3d model-viewer (built with nw.js)

Helpful commands
----------------

```
grunt dev
```

```
grunt doc
```

```
grunt release # compiles files for release
```

```
./release.rb # requires ruby
```

model-viewer
------------

A nw.js desktop app which allows you to view models and animations from
json models exported for three.js

The models I am using are created in blender and exported with the official
three.js blender plugin.

```
cd model-viewer/
./model-viewer
```

![screenshot](model-viewer/screenshot.png)
