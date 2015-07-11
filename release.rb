#!/usr/bin/env ruby
# encoding: utf-8

require 'json'

bower = JSON.parse(File.read("bower.json"))
version = bower['version']

if `git diff bower.json | grep version`.empty?
  fail 'bower.json version not incremented'
end

`bower install`
`grunt release`
`git rm \`git ls-files --deleted\``
`git add .`
`git commit -m "release version #{version}"`
`git tag #{version}`
`git push --tags`
`git push origin master`
