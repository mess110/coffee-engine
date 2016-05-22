#!/usr/bin/env ruby

require 'json'

def read_file(path)
  JSON.parse(File.read(path))
end

file1 = read_file('bunny_idle.json')
file2 = read_file('bunny_hop.json')
file3 = read_file('bunny_die.json')

file1['animations'].concat(file2['animations'])
file1['animations'].concat([file3['animations'][1]])

File.write('bunny_all.json', file1.to_json)
