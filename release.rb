#!/usr/bin/env ruby
# encoding: utf-8

require 'json'

bower = JSON.parse(File.read("bower.json"))
version = bower['version']

`coffee --output build/ -b -c src/`
`git add bower.json`
`git add build/`
`git commit -m "release version #{version}"`
`git tag #{version}`
`git push --tags`
`git push origin master`
