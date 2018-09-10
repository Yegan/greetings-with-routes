module.exports = function (funcGreeting) {
  async function HomeDisplay (req, res, next) {
    try {
      let counterNum = await funcGreeting.count()
      res.render('home', { counterNum })
    } catch (error) {
      next(error.stack)
    }
  }

  async function greetPerson (req, res, next) {
    try {
      let nameEntered = req.body.inputText
      let languageSelected = req.body.language
      if (nameEntered === '' || nameEntered === undefined) {
        req.flash('error', 'Please enter a name')
      } else {
        if (!languageSelected) {
          req.flash('message', 'Please select a language')
          return res.redirect('/')
        }
      }
      let displayName = await funcGreeting.checkGreet(nameEntered, languageSelected)
      let counterNum = await funcGreeting.count()
      res.render('home', { displayName: displayName, counterNum: counterNum, clear: counterNum })
    } catch (error) {
      next(error.stack)
    }
  }

  async function namesGreeted (req, res, next) {
    try {
      let namesDisplay = await funcGreeting.names()
      res.render('namedisplaypage', { namesDisplay: namesDisplay })
    } catch (error) {
      next(error.stack)
    }
  }

  async function reset (req, res, next) {
    try {
      let reset = await funcGreeting.reset()
      res.redirect('/')
    } catch (error) {
      next(error.stack)
    }
  }

  async function nameDisplay (req, res, next) {
    try {
      let myName = req.params.name
      let nameCounter = await funcGreeting.oneName(myName)
      res.render('countdisplay', { name: nameCounter.name, counter: nameCounter.counter })
    } catch (error) {
      next(error.stack)
    }
  }

  return {
    HomeDisplay,
    greetPerson,
    namesGreeted,
    reset,
    nameDisplay

  }
}
