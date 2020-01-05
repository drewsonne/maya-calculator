var introJs = require('../../node_modules/intro.js/intro')

class TutorialState {
  constructor () {
    this.key_name = 'tutorial_has_run'
    this.tutorial_text = `8.19.10.11 # (1) A long count date
+3.4 # (2) A distance number
-7.0

+1.1000 # (3) An 'invalid' distance number
# (4) An example of partial date matches. 
9.10.*.5.* * Chikchan *Sip

`
    this.intro = introJs()

  }

  hasRun () {
    return localStorage.getItem(this.key_name) === 'true'
  }

  setRun (state) {
    localStorage.setItem(this.key_name, Boolean(state).toString())
  }

  start (evaluate) {
    evaluate(this.tutorial_text)
    $(this.input_dom).html(this.tutorial_text)
    // Set the data-intro values
    let that = this
    that.intro.addSteps([
      {
        element: $('span#logo').get(0),
        intro: 'Welcome to the Maya Date Calculator!<br/> <br/> It looks like this is the first time you\'ve visited. This tutorial will walk you through the features of this Calculator. Click \'Next\' or press the return key to get started, or click \'Skip\' to exit the tutorial.',
      },
      {
        element: $('textarea#calendar_input').get(0),
        intro: ' This is the area where all of your operations including addition, subtractions, annotations, and partial matches will go.',
      }])
    $('#longcount_output > tr').slice(1, -1).each(function (index, row) {
      if (index === 0) {
        that.intro.addSteps([
          {
            element: $(row).children('td').get(2),
            intro: 'A long count date will be shown with at least Baktuns. For example, "8.19.10.11" will become "0.8.19.10.11"',
          }, {
            element: $(row).children('td').get(0),
            intro: 'For each Long Count, the Calendar Round will be calculated...',
          }, {
            element: $(row).children('td').get(3),
            intro: '... and the Gregorian date...',
          }, {
            element: $(row).children('td').get(4),
            intro: '... and the Julian date...',
          }, {
            element: $(row).children('td').get(5),
            intro: '... and the Lord of the Night glyph number.',
          }, {
            element: $(row).children('td').get(6),
            intro: 'An annotation can be added at the end of a date row by using the pound symbol (#) followed by the content of the annotation.',
          }, {
            element: row,
            intro: '<i>Example</i></br> A Long Count with an annotation.  <br/><pre>8.19.10.11 # (1) A long count date</pre>',
          }])
      } else if (index === 1) {
        that.intro.addStep({
          element: row,
          intro: 'Distance Numbers can be used to calculate Long Counts in the future.<br/><br/><i>Example</i></br> A distance number with an annotation. <br/><pre>+3.4 # (3) A distance number</pre>',
        })
      } else if (index === 3) {
        that.intro.addStep({
          element: row,
          intro: 'A new Long Count is calculated based on the Distance Number plus the initial Long Count.',
        })
      } else if (index === 4) {
        that.intro.addStep({
          element: row,
          intro: 'Distance Numbers can also be used to calculate times in the past.',
        })
      } else if (index === 7) {
        that.intro.addStep({
          element: row,
          intro: 'Empty lines will be preserved to aid readability.',
        })
      } else if (index === 8) {
        that.intro.addStep({
          element: row,
          intro: 'If invalid values are provided, the calculator will make a best effort to convert them to usable forms.',
        })
      } else if (index === 11) {
        that.intro.addStep({
          element: row,
          intro: 'For more extensive annotations or comments, a line can be reserved for comments only.<br/><br/><i>Example</i></br> An annotation line. <br/><pre># (4) An example of partial date matches.</pre>',
        })
      } else if ([12, 13, 14, 15].includes(index)) {
        that.intro.addStep({
          element: row,
          intro: 'If a source date has components missing, the calculator can provide all combinations which match the provided pattern.<br/><br/><i>Example</i></br> Match a partial Long Count with a partial Calendar Round. <br/><pre>9.10.*.5.* * Chikchan *Sip</pre>',
        })
      }
    })

    that.intro.addSteps([
      {
        element: $('#correlation_constant').get(0),
        intro: 'The Correlation Constant can be set and will be preserved for the period the browser tab is open.',
      }, {
        element: $('#help').get(0),
        intro: 'I hope this is useful to academics, students, or anyone interested in learning how the maya calendar works. Feel free to send me an email at <pre>drew.sonne@gmail.com</pre> or if you would like to contribute or find a bug, you can submit an issue or check out the github repo for this project at <a href="https://github.com/drewsonne/maya-calculator">https://github.com/drewsonne/maya-calculator</a>',
      }])

    that.intro.start()
  }

  initialise (input_dom, force, evaluate, snapback) {
    this.input_dom = $(input_dom)
    if (!this.hasRun() || force) {
      this.setRun(true)
      this.intro.onexit(function () {
        if (snapback !== undefined && snapback !== '') {
          $(this.input_dom).html(snapback)
          evaluate(snapback)
        }
      })
      this.start(evaluate)
    }
  }
}

module.exports = new TutorialState()
