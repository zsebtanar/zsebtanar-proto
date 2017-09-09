const shell = require('shelljs')
const path = require('path')

const bin = path.join(__dirname, '../bin')
const resources = path.join(__dirname, '../src/resources/*')

shell.rm('-rf', bin)
shell.mkdir('-p', bin)
shell.cp('-R', resources, bin)
