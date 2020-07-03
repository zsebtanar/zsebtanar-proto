const shell = require('shelljs')
const path = require('path')
const fs = require('fs')

const bin = path.join(__dirname, '../bin')
const functions = path.join(bin, 'functions')
const app = path.join(bin, 'app')

// clean
shell.rm('-rf', bin)
shell.mkdir('-p', app)
shell.mkdir('-p', functions)

createFunctionPackageJSON()

// utils

function createFunctionPackageJSON() {
  const mainPackageJSON = require('../package.json')
  const deps = mainPackageJSON.dependencies
  const devDeps = mainPackageJSON.devDependencies
  const functionsDeps = mainPackageJSON.config.firebaseFunctionDepencies || []

  const json = {
    name: 'functions',
    description: 'Zsebtanár szerver',
    dependencies: {
      ...functionsDeps.reduce((acc, key) => Object.assign(acc, { [key]: deps[key] }), {}),
    },
    devDependencies: functionsDeps.reduce(
      (acc, key) => Object.assign(acc, { [key]: devDeps[key] }),
      {},
    ),
    private: true,
    engines: { node: '12' },
    main: 'index.js',
  }

  fs.writeFileSync(path.join(functions, 'package.json'), JSON.stringify(json), 'utf8')
}
