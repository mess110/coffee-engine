class FileSystem
  newGame: (json) ->
    return false unless json.name?

    src = "example/3d/#{json.template}/"
    dest = "workspace/games/"
    finalDest = "#{dest}/#{json.name}"

    try
      fs.accessSync finalDest, fs.F_OK
    catch e
      fileSystem.copyFolderRecursiveSync(src, dest)
      fs.renameSync("#{dest}/#{json.template}", finalDest)
    true

  newScene: (workspace, newFilename) ->
    throw new Error('filename missing') unless newFilename?
    scene =
      path: "#{workspace.gamesDir}#{workspace.lastOpenedProject}/assets/scenes/#{newFilename}.save.json"
      engine: {}
      assets: []
      cameras: []
      items: []
      scripts: []
    string = JSON.stringify(scene, null, 2)
    fs.writeFileSync scene.path, string
    scene

  # The asset it copied sync but any asset the asset uses is copied
  # async
  copyAssetSemiSync: (workspace, asset) ->
    src = asset.libPath
    destDir = "#{workspace.gamesDir}#{workspace.lastOpenedProject}/"
    dest = "#{destDir}#{asset.destPath}"

    @copyFileSync(src, dest)
    return unless dest.endsWith('.json')
    fs.readFile dest, 'utf8', (err, data) ->
      if err
        return console.log(err)
      json = JSON.parse(data)

      # blender model
      if json.materials?
        for material in json.materials
          for key of material
            continue unless typeof material[key] == 'string'
            if material[key].endsWithAny(Utils.IMG_URLS)
              to = "#{destDir}assets/#{material[key]}"
              from = asset.libPath.split('/')
              from.pop()
              from = "#{from.join('/')}/#{material[key]}"
              fileSystem.copyFileSync from, to

      return

  copyFileSync: (source, target) ->
    targetFile = target
    #if target is a directory a new file with the same name will be created
    if fs.existsSync(target)
      if fs.lstatSync(target).isDirectory()
        targetFile = path.join(target, path.basename(source))
    fs.writeFileSync targetFile, fs.readFileSync(source)
    return

  copyFolderRecursiveSync: (source, target) ->
    files = []
    #check if folder needs to be created or integrated
    targetFolder = path.join(target, path.basename(source))
    if !fs.existsSync(targetFolder)
      fs.mkdirSync targetFolder
    #copy
    if fs.lstatSync(source).isDirectory()
      files = fs.readdirSync(source)
      files.forEach (file) ->
        curSource = path.join(source, file)
        if fs.lstatSync(curSource).isDirectory()
          fileSystem.copyFolderRecursiveSync curSource, targetFolder
        else
          fileSystem.copyFileSync curSource, targetFolder
        return
    return
