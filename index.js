const express = require('express')
const mongoose = require('mongoose')
//Not yet using the below
mongoose.plugin(require('mongoose-unique-validator'), {
  message: 'Please choose another {PATH}'
})

const { port, dbURI } = require('./config/environment')
const bodyParser = require('body-parser')
const queryHandler = require('./lib/queryHandler')
//Not yet using the below
const router = require('./config/routes')
// const queryHandler = require('./lib/queryHandler')
const errorHandler = require('./lib/errorHandler')

const app = express()
//Not yet using the below
// app.use(queryHandler)
mongoose.connect(dbURI, { useNewUrlParser: true })
// look for static files in the 'dist' folder
// static files are files like index.html, images, fonts, styles etc...
app.use(express.static(`${__dirname}/dist`))
app.use(bodyParser.json())
app.use(queryHandler)
app.use('/api', router)
app.use(errorHandler)

app.listen(port, () => console.log('Listening to port 4000'))

module.exports = app // Export the app for testing
