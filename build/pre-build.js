const fs = require('fs')
const shell = require('shelljs')
const path = require('path')

const bin = path.join(__dirname, '../bin')
const resources = path.join(__dirname, '../src/resources/*')
const functions = path.join(bin, 'functions')
const functionsStorage = path.join(bin, 'functions/src/storage/')
const app = path.join(bin, 'app')

// clean
shell.rm('-rf', bin)
shell.mkdir('-p', app)
shell.mkdir('-p', functions)
shell.mkdir('-p', functionsStorage)

// copy resources
shell.cp('-R', resources, app)

// create service-account-credentials.json
fs.writeFileSync(
  path.join(functionsStorage, 'service-account-credentials.json'),
  JSON.stringify(JSON.parse((process.env.SERVICE_ACCOUNT_CREDENTIALS || '{}').replace(/\\n/g, '\\\\n')), null, 3),
  'utf8'
)
