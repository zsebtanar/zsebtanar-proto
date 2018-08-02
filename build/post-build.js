const shell = require('shelljs')
const path = require('path')

const bin = path.join(__dirname, '../bin')
const resources = path.join(__dirname, '../resources/*')
const app = path.join(bin, 'app')

// copy resources
shell.cp('-R', resources, app)
