// DEPENDENCIES
require('dotenv').config()
const express = require('express')
const app = express()

// CONFIGURATION
const PORT = process.env.PORT || 3000
const mongodbURI = process.env.MONGODBURI || 'mongodb://localhost:27017/'+'blogger'





// APP LISTEN ON PORT
app.listen(PORT, ()=>{
    console.log(`Welcome to Blogger! Listening for requests on PORT ${PORT}...`)
})