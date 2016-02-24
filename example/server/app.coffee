#!/usr/bin/env coffee

app = require('express.io')()
app.http().io()
io = app.io

info =
  version: 1
  port: 7076

io.on 'connection', (socket) ->
  socket.emit 'ready', info

  socket.on 'ready', (data) ->
    console.log data

app.get '/', (req, res) ->
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(info))

console.log "Listening on port #{info.port}"
app.listen info.port
