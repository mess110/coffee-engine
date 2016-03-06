coffee-engine project template
------------------------------

This is the starting point of your project. It has support for menus, loading,
mutliplayer out of the box.

If you choose not to have multiplayer, you could host your game on Github Pages
(client side only)

Project Structure
=================

* assets/ - a place to store your assets
* css/ - sass enabled
* js/
  * models/
    * Player.coffee - example model
  * scenes/
    * GameScene.coffee - example scene
  * server/
    * Game.coffee - server side game logic
    * Server.coffee - server config
* bower.json
* index.html - landing page of your game
* package.json
* README.md - this file

Quickstart
==========

NOTE: You will need node.js installed.

```
npm install
npm prod
```

This will compile the assets and start the webserver.

For development, run these commands in different terminals:

```
npm run coffee
npm run sass
npm run server
```

The documentation provides a lot of useful information.
