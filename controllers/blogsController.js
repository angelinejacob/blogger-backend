const router = require('express').Router()
const { Blog, Comment } = require('../models/blog')
const User = require('../models/user')

// CREATE ROUTE
router.post('/:id', (req, res) => {
    console.log("Hit post route to create a blog")
    User.findById(req.params.id)
    .populate('blogs')
    .exec((error, foundUser) => {
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
                    res.json(foundUser)
                }
            })
        }
    })

    // User.findById(req.params.id, (error, foundUser) => {
    //     if(error){
    //         console.log("error while creating new blog >> ", error)
    //     }
    //     else {
    //         console.log(foundUser)
    //         // create the new blog and add it to user's blog array
    //         Blog.create(req.body, (error, createdBlog) => {
    //             if(error){
    //                 console.log(error)
    //             }
    //             else{
    //                 foundUser.blogs.push(createdBlog)
    //                 foundUser.save(function(error, savedUser){
    //                     if(error) console.log(error)
    //                 })
    //                 // add foundUser as a reference to the blog we just created
    //                 createdBlog.author = foundUser
    //                 createdBlog.save(function(error, savedUser){
    //                     if(error) console.log(error)
    //                 })
    //                 res.json(foundUser)
    //             }
    //         })
    //     }
    // })
    
})

// CREATE COMMENT ROUTE
router.post('/comment/:blogId', (req, res) => {
    Comment.create(req.body, (error, createdComment) => {
        if(error) console.log(error)
        Blog.findById(req.params.blogId, (error, foundBlog) => {
            if(error) console.log(error)

            // add new comment to requested blog
            foundBlog.comments.push(createdComment)

            // save blog
            foundBlog.save(function(error, savedBlog){
                if(error) console.log(error)
                res.json(savedBlog)
            })
        })
    })
})

// EDIT ROUTE - handles content updates and likes
router.put('/:userId/:blogId', (req, res) => {
    console.log("In blog edit route...")
    console.log(req.params.blogId)
    console.log(Object.keys(req.body).length, "body length")
    console.log(req.body.likes, "req.body.likes")
    if(req.body.likes !== undefined && Object.keys(req.body).length  === 1){
        // if body contains a new value for likes, and likes is the only key in req.body
        Blog.findById(req.params.blogId, (error, foundBlog) => {
            if(error) console.log(error)
            // find out if likes are being incremented or decremented
            let increment = true
            if(foundBlog.likes < req.body.likes){
                // increment the likes on found blog
                foundBlog.likes += 1
            }
            else {
                increment = false
                foundBlog.likes -= 1
            }
    
            // find user and add blog to favorite Blogs array
            User.findById(req.params.userId, (error, foundUser) => {
                if(increment){
                    // add blog to favorite blogs array in user
                    foundUser.favoriteBlogs.push(foundBlog)
                }
                else {
                    // remove blog from favorite blogs array of user
                    let favBlogs = foundUser.favoriteBlogs
                    let index = favBlogs.indexOf(req.params.blogId)
                    favBlogs.splice(index, 1)

                }
    
                // save blog
                foundBlog.save(function(error, savedBlog){
                    if(error) console.log("error while liking blog >>> ", error)
                })
    
                // save user
                foundUser.save(function(error, savedUser){
                    if(error) console.log(error)
                    res.json(savedUser)
                })
            })
        })
        
    }
    else {
        // if the method was not called to increase likes then just a regular update
        Blog.findByIdAndUpdate(req.params.blogId, req.body, { new: true }, (error, updatedBlog) => {
            if(error) console.log("error while editing blog >> ", error)
            res.json(updatedBlog)
        })

    }
})


// SHOW ROUTE
router.get('/:blogId', (req, res) => {
    console.log("inside blog show route...")

    Blog.findById(req.params.blogId)
    .populate('author')
    .exec((error, foundBlog) => {
        if(error) console.log(error)
        res.json(foundBlog)
    })
    // Blog.findById(req.params.blogId, (error, foundBlog) => {
    //     if(error) console.log(error)
    //     res.json(foundBlog)
    // })
})


// INDEX ROUTE
router.get('/', (req, res) => {
    console.log("inside blog index route...")
    Blog.find({}, (error, foundBlogs) => {
        if(error) console.log(error)
        res.json(foundBlogs)
    })
})

// DELETE ROUTE
router.delete('/:userId/:blogId', (req, res) => {
    console.log("blog delete route hit...")
    // find the user
    User.findById(req.params.userId, (error, foundUser) => {
        if(error) console.log('ERROR while deleting blog >> ', error)

        // find index of blog you want to remove and remove it from blogs array
        let blogs = foundUser.blogs
        let index = blogs.indexOf(req.params.blogId)
        blogs.splice(index, 1)

        Blog.findByIdAndRemove(req.params.blogId, (error, deletedBlog) => {
            if(error) console.log("ERROR while deleting blog")
        })
        foundUser.save(function(error, savedUser){
            if(error) console.log("ERROR while saving user after deleting blog >> ", error)
            res.json(savedUser)
        })
    })
})

module.exports = router