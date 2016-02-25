#!/usr/bin/env coffee

path = require('path')
express = require('express.io')

app = express()
app.http().io()
io = app.io

info =
  version: 1
  port: 7076

app.use('/', express.static(path.join(__dirname, '../../')))

app.get '/info.json', (req, res) ->
  res.setHeader('Content-Type', 'application/json')
  res.send(JSON.stringify(info))

io.on 'connection', (socket) ->
  socket.emit 'ready', info

  socket.on 'ready', (data) ->
    console.log data

console.log "Listening on port #{info.port}"
app.listen info.port
