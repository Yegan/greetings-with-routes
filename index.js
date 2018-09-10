const express = require('express')
const app = express()
const flash = require('express-flash')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const GreetingDB = require('./greetingfactoryfunc')
const postgres = require('pg')
const Pool = postgres.Pool
const GreetingRoutes = require('./greetings-routes.js')
// const routeGreet = GreetingRoutes(greetingFunc)

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greetings'
const pool = new Pool({
  connectionString
})

const greetingDataBase = GreetingDB(pool)
const greetingRoute = GreetingRoutes(greetingDataBase)

let useSSL = false
let local = process.env.LOCAL || false
if (process.env.DATABASE_URL && !local) {
  useSSL = true
}

// Handlebar engine allowing for templating of data

app.engine('handlebars', exphbs({
  defaultLayout: 'main'

}))

app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
  extended: false
}))

// initialise session middleware - flash-express depends on it
app.use(session({
  secret: '<add a secret string here>',
  resave: false,
  saveUninitialized: true
}))

// initialise the flash middleware
app.use(flash())
app.use(bodyParser.json())

// renders the homepage

app.get('/', greetingRoute.HomeDisplay)

// Post route that inputs from the user ie the name(Andrew) , and displaying this on the home.handlebars page

app.post('/greetings', greetingRoute.greetPerson)
// this get route display the name greeted and the language selected to be greeted in

app.get('/namesGreeted', greetingRoute.namesGreeted)

// this post route resets the counter and the names in the database by deleting the entries in the database

app.post('/reset', greetingRoute.reset)

// this get route displays the name in the route that is greeted and displays how many times that name has been greeted

app.get('/display/:name', greetingRoute.nameDisplay)

let PORT = process.env.PORT || 3009

app.listen(PORT, function () {
  console.log('App starting on port', PORT)
})
