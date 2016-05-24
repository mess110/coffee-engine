app.controller 'LandingController', ['$scope', '$mdToast', '$location', ($scope, $mdToast, $location) ->
  EngineHolder.get().engine.removeDom()
]
