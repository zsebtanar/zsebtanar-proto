const fs = require('fs')
const shell = require('shelljs')
const path = require('path')

const bin = path.join(__dirname, '../bin')
const resources = path.join(__dirname, '../src/resources/*')
const functions = path.join(__dirname, '../functions/')

// clean
shell.rm('-rf', bin)
shell.mkdir('-p', bin)

// copy resources
shell.cp('-R', resources, bin)

// create service-account-credentials.json
fs.writeFileSync(
  path.join(functions, 'service-account-credentials.json'),
  process.env.SERVICE_ACCOUNT_CREDENTIALS || '',
  'utf8'
)
