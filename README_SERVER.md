coffee-engine server
--------------------

To start the server in dev mode:

```
npm run server
```

To define an event socket.io would listen to, you need to do 2 things:

- add the method name as a string in IO_METHODS
- define the function according with socket and data as params

```
class GameServer
  IO_METHODS: ['foo']

  foo: (socket, data) ->
    console.log("received foo #{data}")
```

By default it listens to connect and disconnect and calls these methods on the
GameServer

```
  class GameServer
    IO_METHODS: []

    connect: (socket) ->
      console.log socket.id

    disconnect: (socket, data) ->
      console.log socket.id
```

Tutorial
========

Use examples/3d/project as your starting point. It contains the server side of
your game.

It comes with:

- Dependencies loaded (using npm)
- Project architecture
- Build tools
