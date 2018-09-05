const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const greetingFunc = require('./GreetingFactoryFunc')
const postgres = require('pg');
const Pool = postgres.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/greetings';
const pool = new Pool({
    connectionString
});
const funcGreeting = greetingFunc(pool)

let useSSL = false;
let local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}


app.engine('handlebars', exphbs({
    defaultLayout: 'main'

}))

app.set('view engine', 'handlebars')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

app.get('/', async function (req, res, next) {
    try{
        let counterNum = await funcGreeting.count();
        res.render('home', {counterNum})
    }

    catch (err){
        next(error.stack)
    }

    
})

// Post the input from the user ie the name(Andrew) , and displaying this on the home.handlebars page

app.post('/greetings', async function (req, res, next) {
    let nameEntered = req.body.inputText;
    let languageSelected = req.body.language;
    try {
        let displayName =  await funcGreeting.checkGreet(nameEntered, languageSelected);
        let counterNum = await funcGreeting.count();
        // console.log(counterNum)

    res.render('home', { displayName: displayName, counterNum: counterNum, clear: counterNum  })
    } catch (error) {
    //    console.log('READ ERROR' +next(error.stack))
    }
    
})


app.get('/namesGreeted', async function (req, res, next) {

    try{
        let namesDisplay = await funcGreeting.names();
        res.render('nameDisplayPage',{namesDisplay: namesDisplay});
    }
   
    catch(error){
       next(error.stack)
    }
})

app.post('/reset', async function(req,res, next){
    try{
        let reset = await funcGreeting.reset();
        res.redirect('/')
    }
    catch(error){
        next(error.stack)
    }
})



let PORT = process.env.PORT || 3009

app.listen(PORT, function () {
    console.log('App starting on port', PORT)

})