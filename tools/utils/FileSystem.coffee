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

  # returns array of asset dependencies for the asset
  copyAssetSync: (workspace, asset) ->
    toReturn = []

    src = asset.libPath
    destDir = "#{workspace.gamesDir}#{workspace.lastOpenedProject}/"
    dest = "#{destDir}#{asset.destPath}"

    @copyFileSync(src, dest)
    return unless dest.endsWith('.json')
    data = fs.readFileSync dest, 'utf8'
    json = JSON.parse(data)

    # terrain
    if json.heightmap?
      for s in ['heightmap', 'texture']
        from = json[s].libPath
        fileName = json[s].libPath.split('/').last()
        toRelativeToGame = "assets/#{fileName}"
        to = "#{destDir}#{toRelativeToGame}"

        fileSystem.copyFileSync(from, to)

        aaa = JSON.parse(fs.readFileSync(dest, 'utf8'))
        aaa[s].destPath = toRelativeToGame
        aaa[s].type = 'texture'
        string = JSON.stringify(aaa, null, 2)

        fs.writeFileSync dest, string
        toReturn.push aaa[s]

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

    toReturn

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
