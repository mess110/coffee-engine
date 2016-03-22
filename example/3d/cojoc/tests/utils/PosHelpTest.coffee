assert = require('assert')

require('../../bower_components/coffee-engine/src/shared/SyntaxSugar')
PosHelp = require('../../js/utils/PosHelp').PosHelp

PosHelp.isOwn = (result) ->
  result

describe 'PosHelp', ->
  before ->

  it 'works', ->
    console.log PosHelp.heroPresent2(true)
