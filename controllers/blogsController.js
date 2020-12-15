const router = require('express').Router()
const { Blog, Comment } = require('../models/blog')
const User = require('../models/user')

// CREATE ROUTE
router.post('/:id', (req, res) => {
    console.log("Hit post route to create a blog")
    User.findById(req.params.id, (error, foundUser) => {
        if(error){
            console.log("error while creating new blog >> ", error)
        }
        else {
            console.log(foundUser)
            // create the new blog and add it to user's blog array
            Blog.create(req.body, (error, createdBlog) => {
                if(error){
                    console.log(error)
                }
                else{
                    foundUser.blogs.push(createdBlog)
                    foundUser.save(function(error, savedUser){
                        if(error) console.log(error)
                    })
                    // add foundUser as a reference to the blog we just created
                    createdBlog.author = foundUser
                    createdBlog.save(function(error, savedUser){
                        if(error) console.log(error)
                    })
                    res.json(createdBlog)
                }
            })
        }
    })
    
})

// EDIT ROUTE 
router.put('/:userId/:blogId', (req, res) => {
    console.log("In blog edit route...")
})

// INDEX ROUTE
router.get('/', (req, res) => {
    console.log("inside blog index route...")
    Blog.find({}, (error, foundBlogs) => {
        if(error) console.log(error)
        res.json(foundBlogs)
    })
})

module.exports = router