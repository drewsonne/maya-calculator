var introJs = require('intro.js')

class TutorialState {
  constructor () {
    this.key_name = 'tutorial_has_run'
  }

  hasRun () {
    return localStorage.getItem(this.key_name) === 'true'
  }

  setRun (state) {
    localStorage.setItem(this.key_name, Boolean(state).toString())
  }

  start () {
    introJs().start()
  }

  initialise () {
    // if (!this.hasRun()) {
    this.setRun(true)
    this.start()
    // }
  }
}

module.exports = new TutorialState()
