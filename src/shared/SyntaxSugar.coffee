# @example
#   [].isEmpty()
Array::isEmpty = ->
  @.length == 0

# @example
#   [1].any()
Array::any = ->
  !@isEmpty()

# @example
#   [1, 2].clear()
Array::clear = ->
  @.pop() while @any()

# @example
#   [1, 2].last()
Array::last = ->
  @[@length - 1]

# @example
#   [1].first()
Array::first = ->
  @[0]

# @example
#   [].size()
Array::size = ->
  @.length

# @example
#   [1, 2].includes(1)
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

# Check if 2 arrays are equal
Array::equalsArray = (a) ->
  eq = true
  for i in [0..a.size()]
    if a[i] != @[i]
      eq = false
      break
  eq

Array::random = ->
  @.shuffle().first()

# Difference between arrays
Array::diff = (a) ->
  @filter (i) ->
    a.indexOf(i) < 0

# Remove element from an array
Array::remove = (e) ->
  pos = @.indexOf(e)
  @.splice(pos, 1) if pos > -1
  if pos > -1 then e else null

# Find element in array with a specific id
Array::findById = (id) ->
  @filter (i) ->
    i.id == id

# Sum all the elements of an array
Array::sum = ->
  sum = 0
  for e in @
    sum += e
  sum

# Query for array elements
Array::where = (hash) ->
  @.filter (d) ->
    ok = true
    for key of hash
      found = false
      if hash[key] instanceof Array
        for item in hash[key]
          if d[key] == item
            found = true
            break
        ok = ok && found
      else
        ok = ok && d[key] == hash[key]
    ok

# Add an item at a specific position
Array::insert = (index, item) ->
  @splice index, 0, item
  return

Array::toCyclicArray = ->
  new CyclicArray(@)

Array::shallowClone = ->
  JSON.parse(JSON.stringify(@))

# Returns the length of a string
String::size = (s) ->
  @.length

# Checks if a string s starts with another string
String::startsWith = (s) ->
  @.indexOf(s) == 0

# Checks if an string starts with any of the prefixes.
# The prefixes is an array of strings
String::startsWithAny = (prefixes) ->
  startsWith = false
  for prefix in prefixes
    startsWith = true if @.startsWith(prefix)
  startsWith

# Checks if a string ends with another string
#
# @param [String] suffix
String::endsWith = (suffix) ->
  @indexOf(suffix, @length - (suffix.length)) != -1

# Checks if an array ends with any of the prefixes
#
# @param [Array] suffixes
String::endsWithAny = (suffixes) ->
  endsWith = false
  return false unless suffixes?
  for suffix in suffixes
    endsWith = true if @.endsWith(suffix)
  endsWith

# Replaces any of the sources as dest String
#
# @param [Array] sources
# @param [String] dest
String::replaceAny = (sources, dest) ->
  tmp = @
  for source in sources
    tmp = tmp.replace(source, dest)
  tmp

# Checks if a string has size 0
String::isEmpty = ->
  @.size() == 0

# Checks if a string contains a substring
String::contains = (s) ->
  @.indexOf(s) != -1

String::containsAny = (strings) ->
  containsAny = false
  return false unless strings?
  for s in strings
    containsAny = true if @.contains(s)
  containsAny

# Checks if a string is not empty
String::isPresent = ->
  @? and !@.isEmpty()

# Capitalizes first letter
String::capitalizeFirstLetter = ->
  @charAt(0).toUpperCase() + @slice(1)

# Check if value is a number
isNumeric = (n) ->
  !isNaN(parseFloat(n)) and isFinite(n)

# Checks if a number ends with a char sequence
Number::endsWith = (s) ->
  @.toString().endsWith(s)

console.ce = (message) ->
  if Config? && !Config.get().debug
    return
  console.log(message)
  return

# Used for next() and prev()
class CyclicArray
  constructor: (items = []) ->
    @items = items
    @index = 0

  get: ->
    @items[@index]

  next: () ->
    @index += 1
    @index = 0 if @index > @items.size() - 1
    @get()

  prev: ->
    @index -= 1
    @index = @items.size() - 1 if @index < 0
    @get()

  size: ->
    @items.size()

whichAnimationEvent = ->
  el = document.createElement('fakeelement')
  animations =
    'animation': 'animationend'
    'OAnimation': 'oAnimationEnd'
    'MozAnimation': 'animationend'
    'WebkitAnimation': 'webkitAnimationEnd'
  for t of animations
    if el.style[t] != undefined
      return animations[t]
  return

# Used for continously looping sounds from the SoundManager
class Playlist
  # @param [Array] keys
  constructor: (keys) ->
    throw new Error('keys needs to be an array') unless keys instanceof Array
    for key in keys
      unless SoundManager.has(key)
        throw new Error("key '#{key}' not loaded in SoundManager")
    @items = new CyclicArray(keys)

  # start playing the playlist
  #
  # @example
  #   playlist = new Playlist(['shotgun', 'hit'])
  #   playlist.play()
  #
  # @see getPlayingKey
  cmd: (options)->
    options.key = @items.get()
    if options.type == 'volumeAll'
      options.type = 'volume'
      for item in @items.items
        options.key = item
        SoundManager.cmd(options)
    else
      audio = SoundManager.cmd(options)
    if ['play', 'fadeIn'].includes(options.type)
      audio._onend = []
      audio.on 'end', (data) =>
        @items.next()
        @cmd(options)
    else if ['volume', 'volumeAll'].includes(options.type)
      # do nothing
    else
      audio._onend = []

  # Get the key of the sound currently playing
  #
  # @example
  #   playlist = new Playlist(['shotgun', 'hit'])
  #   playlist.play()
  #   SoundManager.pause(playlist.getPlayingKey())
  getPlayingKey: ->
    @items.get()

  # Get the audio object which is currently playing
  getPlayingAudio: ->
    SoundManager.get().items[@getPlayingKey()]
