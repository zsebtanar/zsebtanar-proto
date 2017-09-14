const shell = require('shelljs')
const path = require('path')

const bin = path.join(__dirname, '../bin')
const functions = path.join(bin, 'functions')
const app = path.join(bin, 'app')

// clean
shell.rm('-rf', bin)
shell.mkdir('-p', app)
shell.mkdir('-p', functions)
