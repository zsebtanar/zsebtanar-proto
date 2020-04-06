const fs = require('fs')
const path = require('path')
const shell = require('shelljs')
const config = require('./config')

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

// htmlConfig.headers.push({
//   key: 'Content-Security-Policy-Report-Only',
//   value: config.getCSPConfig(true)
// })
//
// if (!reportOnly) {
//   htmlConfig.headers.push({
//     key: 'Content-Security-Policy',
//     value: config.getCSPConfig(false)
//   })
// }

// fs.writeFileSync(firebaseConfigFile, JSON.stringify(firebaseConfig, null, 3), 'utf8')

// Robot txt
const robotTxtFile = path.join(app, 'robot.txt')
fs.writeFileSync(robotTxtFile, config.getRobotTxt(), 'utf8')
