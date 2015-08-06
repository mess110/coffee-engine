Array::isEmpty = ->
  @.length == 0

Array::any = ->
  !@isEmpty()

Array::clear = ->
  @.pop() while @any()

Array::last = ->
  @[@length - 1]

Array::first = ->
  @[0]

Array::size = ->
  @.length

Array::includes = (e) ->
  @.indexOf(e) != -1

# https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
Array::shuffle = ->
  array = @
  m = array.length
  t = undefined
  i = undefined

  # While there remain elements to shuffle…
  while m
    # Pick a remaining element…
    i = Math.floor(Math.random() * m--)

    # And swap it with the current element.
    t = array[m]
    array[m] = array[i]
    array[i] = t
  array

Array::equalsArray = (a) ->
  eq = true
  for i in [0..a.size()]
    if a[i] != @[i]
      eq = false
      break
  eq

Array::diff = (a) ->
  @filter (i) ->
    a.indexOf(i) < 0

Array::remove = (e) ->
  pos = @.indexOf(e)
  @.splice(pos, 1) if pos > -1
  if pos > -1 then e else null

Array::findById = (id) ->
  @filter (i) ->
    i.id == id

Array::sum = ->
  sum = 0
  for e in @
    sum += e
  sum

String::size = (s) ->
  @.length

String::startsWith = (s) ->
  @.indexOf(s) == 0

String::isEmpty = ->
  @.size() == 0

String::contains = (s) ->
  @.indexOf(s) != -1

String::isPresent = ->
  @? and !@.isEmpty()

String::capitalizeFirstLetter = ->
  @charAt(0).toUpperCase() + @slice(1)
