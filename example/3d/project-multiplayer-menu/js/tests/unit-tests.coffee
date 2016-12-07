assert = (condition, message) ->
  if !condition
    message = message or 'Assertion failed'
    if typeof Error != 'undefined'
      throw new Error(message)
    throw message
    # Fallback
  return
