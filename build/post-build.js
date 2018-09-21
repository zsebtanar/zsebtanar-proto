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

const htmlConfig = firebaseConfig.hosting.headers.find(x => x.source === '**/*.html')
htmlConfig.headers.push({
  key: reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
  value: getCSPConfig(reportOnly)
})

fs.writeFileSync(firebaseConfigFile, JSON.stringify(firebaseConfig, null, 3), 'utf8')
