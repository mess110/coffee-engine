# The name of the getMethods is important.
# Looking at the asset type, we can generate the getMethod,
# for example:
#
# asset.type = model coresponds to getModels
class WorkspaceQuery

  getProjects: (workspace, callback) ->
    projectPaths = "#{workspace.gamesDir}**/.coffee-engine"
    glob(projectPaths, {}, (err, folders) ->
      projects = []
      for project in folders
        projects.push project.split('/').slice(-2, -1)[0]
      callback(err, projects)
    )

  getTextures: (workspace, callback) ->
    texturePaths = "#{workspace.localLib}/textures/**/*.png"
    glob(texturePaths, {}, (err, files) ->
      array = WorkspaceQuery._keify(files, Utils.IMG_URLS)
      callback(err, array)
    )

  getModels: (workspace, callback) ->
    path = workspace.modelRepository
    glob("#{path}/**/*.json", {}, (err, files) ->
      files = WorkspaceQuery._keify(files, Utils.JSON_URLS)
      callback(err, files)
    )

  getParticles: (workspace, callback) ->
    terrainPaths = "#{workspace.localLib}/particles/**/*.save.json"
    glob(terrainPaths, {}, (err, files) ->
      files = WorkspaceQuery._keify(files, Utils.SAVE_URLS)
      callback(err, files)
    )

  getTerrains: (workspace, callback) ->
    terrainPaths = "#{workspace.localLib}/terrains/**/*.save.json"
    glob(terrainPaths, {}, (err, files) ->
      files = WorkspaceQuery._keify(files, Utils.SAVE_URLS)
      callback(err, files)
    )

  getSounds: (workspace, callback) ->
    soundPaths = "#{workspace.localLib}/sounds/**/*.*"
    glob(soundPaths, {}, (err, files) ->
      files = WorkspaceQuery._keify(files, Utils.AUDIO_URLS)
      callback(err, files)
    )

  getScenes: (workspace, game, callback) ->
    scenePaths = "#{workspace.gamesDir}#{game}/assets/scenes/**.save.json"
    glob(scenePaths, {}, (err, files) ->
      callback(err, files)
    )

  @_keify = (items, urls) ->
    a = []
    for item in items
      a.push
        key: Utils.getKeyName(item, urls)
        libPath: item
    a
