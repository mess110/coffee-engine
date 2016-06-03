app.directive 'fileSelect', ['$window', ($window) ->
  {
    restrict: 'A'
    require: 'ngModel'
    link: (scope, el, attr, ctrl) ->
      fileReader = new ($window.FileReader)

      fileReader.onload = ->
        ctrl.$setViewValue fileReader.result
        if 'fileLoaded' of attr
          scope.$eval attr['fileLoaded']
        return

      fileReader.onprogress = (event) ->
        if 'fileProgress' of attr
          scope.$eval attr['fileProgress'],
            '$total': event.total
            '$loaded': event.loaded
        return

      fileReader.onerror = ->
        if 'fileError' of attr
          scope.$eval attr['fileError'], '$error': fileReader.error
        return

      fileType = attr['fileSelect']
      el.bind 'change', (e) ->
        fileName = e.target.files[0]
        if fileType == '' or fileType == 'text'
          fileReader.readAsText fileName
        else if fileType == 'data'
          fileReader.readAsDataURL fileName
        return
      return
  }
]

app.directive 'customOnChange', ->
  {
    restrict: 'A'
    link: (scope, element, attrs) ->
      onChangeHandler = scope.$eval(attrs.customOnChange)
      element.bind 'change', onChangeHandler
      return

  }

app.directive 'ngRightClick', ($parse) ->
  (scope, element, attrs) ->
    fn = $parse(attrs.ngRightClick)
    element.bind 'contextmenu', (event) ->
      scope.$apply ->
        event.preventDefault()
        fn scope, $event: event
        return
      return
    return
