const program = require('commander')
const { prompt } = require('inquirer')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const download = require('download-git-repo')
const ora = require('ora')

//var template = require(`${__dirname}/../templates`)

var project = program.args[0]
var inPlace = !project || project === '.'
var name = inPlace ? path.relative('../', process.cwd()) : project
var to = path.resolve(project || '.')

// console.log(`project name: ${project}`)
// console.log(`name: ${name}`)
// console.log(`to: ${to}`)

const question = [
  {
    type: 'confirm',
    name: 'ok',
    message: inPlace 
    ? 'Generate project in current directory?' 
    : 'Target directory exists. Continue?'
  }]

module.exports = prompt(question).then((answers) => {

  if (!answers.ok) {
    return
  }
  const gitPlace = 'hujewelz/koas' //template[name]['owner']
  const gitBranch = 'master' //template[name]['branch']
  const spinner = ora('Downloading template...')

  spinner.start()

  download(`${gitPlace}#${gitBranch}`, `${to}`, (err) => {
    if (err) {
      console.log(chalk.red(err))
      process.exit()
    }
    
    const package = require(`${to}/package.json`)
    package.name = name

    fs.writeFile(`${to}/package.json`, JSON.stringify(package, null, 4), (err) => {
      if (err) {
        console.log(chalk.red(err))
        process.exit()
      }
      spinner.stop()
      console.log(chalk.green('New project has been initialized successfully!'))
      console.log(require(`${to}/package.json`))
    })

  })
})
