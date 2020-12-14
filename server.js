// DEPENDENCIES
require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const formData = require('express-form-data')
const os = require('os')


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

// MIDDLEWARE
/**
 * Options are the same as multiparty takes.
 * But there is a new option "autoClean" to clean all files in "uploadDir" folder after the response.
 * By default, it is "false".
 */
const options = {
    uploadDir: "./uploads",
    autoClean: true
}


// parse data with connect-multiparty. 
app.use(formData.parse(options))
// delete from the request all empty files (size == 0)
app.use(formData.format())
// change the file objects to fs.ReadStream 
app.use(formData.stream())
// union the body and the files
app.use(formData.union())
app.use(express.urlencoded({ extended: true }))

// MAIN ROUTE
app.get('/', (req, res) => {
    console.log("received request on main route...")
    res.send("Hello World!")
})

// CONTROLLERS
const userController = require('./controllers/usersController')
app.use('/users', userController)

// APP LISTEN ON PORT
app.listen(PORT, ()=>{
    console.log(`Welcome to Blogger! Listening for requests on PORT ${PORT}...`)
})