coffee-engine
=============

Has 3 modules:

1. 3d engine ~ thin layer over three.js in coffeescript
2. 2d engine
3. 3d model-viewer (built with nw.js)

development
-----------

```
grunt dev
```

To release a new version:

```
ruby release.rb
```

model-viewer
------------

Remember to edit modelsDirPath

```
cd model-viewer/
./model-viewer
```

![screenshot](model-viewer/screenshot.png)
