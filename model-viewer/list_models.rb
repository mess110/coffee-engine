#!/usr/bin/env ruby
# encoding: utf-8

# Example usage:
#
# ./list_models.rb '/home/kiki/pr0n/blender'
#

require 'json'

fail 'missing directory' if ARGV.length != 1
dir = ARGV[0] # '/home/kiki/pr0n/blender'

output = {
  files: Dir.glob(File.join(dir, '/**/*.json'))
}

puts output.to_json
