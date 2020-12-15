const router = require('express').Router()
const Blog = require('../models/blog')

// CREATE ROUTE
router.post('/', (req, res) => {
    res.send("Hit post route to create a blog")
})

module.exports = router