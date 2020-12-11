// DEPENDENCIES
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')

// CONFIGURATION
const PORT = process.env.PORT || 3000
const mongodbURI = process.env.MONGODBURI || 'mongodb://localhost:27017/'+'blogger'
const db = mongoose.connection

// CONNECT TO DB
mongoose.connect(
    mongodbURI, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    },
    () => {
        console.log('the connection with mongodb is establised at: ', mongodbURI)
    }
)

// CALL BACK FUNCTIONS FOR DB EVENTS
db.on('error', error => console.log(error.message + 'is mongod not running?'))
db.on('disconnected', () => console.log("mongo disconnected"))


// MAIN ROUTE
app.get('/', (req, res) => {
    console.log("received request on main route...")
    res.send("Hello World!")
})


// APP LISTEN ON PORT
app.listen(PORT, ()=>{
    console.log(`Welcome to Blogger! Listening for requests on PORT ${PORT}...`)
})