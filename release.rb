#!/usr/bin/env ruby
# encoding: utf-8

require 'json'

package = JSON.parse(File.read("package.json"))
version = package['version']

if `git diff package.json | grep version`.empty?
  fail 'package.json version not incremented'
end

`npm install`
`grunt build`
`git rm \`git ls-files --deleted\``
`git add .`
`git commit -m "release version #{version}"`
`git tag #{version}`
`git push --tags`
`git push origin master`
