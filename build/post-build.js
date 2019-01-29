const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const getCSPConfig = require('./config').getCSPConfig

const bin = path.join(__dirname, '../bin')
const resources = path.join(__dirname, '../resources/*')
const app = path.join(bin, 'app')

// copy resources
shell.cp('-R', resources, app)

// update firebase hosting headers
const reportOnly = true
const firebaseConfigFile = path.join(__dirname, '../firebase.json')
const firebaseConfig = require(firebaseConfigFile)

const htmlConfig = firebaseConfig.hosting.headers.find(x => x.source === '**')

htmlConfig.headers = htmlConfig.headers.filter(h => !h.key.startsWith('Content-Security-Policy'))

htmlConfig.headers.push({
  key: 'Content-Security-Policy-Report-Only',
  value: getCSPConfig(true)
})

if (!reportOnly) {
  htmlConfig.headers.push({
    key: 'Content-Security-Policy',
    value: getCSPConfig(false)
  })
}

fs.writeFileSync(firebaseConfigFile, JSON.stringify(firebaseConfig, null, 3), 'utf8')
