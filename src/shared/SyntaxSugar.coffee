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

# Returns the length of a string
String::size = (s) ->
  @.length

# Checks if a string s starts with another string
String::startsWith = (s) ->
  @.indexOf(s) == 0

String::startsWithAny = (prefixes) ->
  startsWith = false
  for prefix in prefixes
    startsWith = true if @.startsWith(prefix)
  startsWith

String::endsWith = (suffix) ->
  @indexOf(suffix, @length - (suffix.length)) != -1

String::endsWithAny = (suffixes) ->
  endsWith = false
  for suffix in suffixes
    endsWith = true if @.endsWith(suffix)
  endsWith

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

# Checks if a string is not empty
String::isPresent = ->
  @? and !@.isEmpty()

# Capitalizes first letter
String::capitalizeFirstLetter = ->
  @charAt(0).toUpperCase() + @slice(1)

# Check if value is a number
isNumeric = (n) ->
  !isNaN(parseFloat(n)) and isFinite(n)
