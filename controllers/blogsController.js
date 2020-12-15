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

// LIKE ROUTE - might just use the other edit route instead
// router.put('/like/:userId/:blogId', (req, res) => {
//     Blog.findById(req.params.blogId, (error, foundBlog) => {
//         // increment the likes on found blog
//         foundBlog.likes += 1

//         // find user and add blog to favorite Blogs array
//         User.findById(req.params.userId, (error, foundUser) => {
//             // add blog to favorite blogs array in user
//             foundUser.favoriteBlogs.push(foundBlog)

//             // save blog
//             foundBlog.save(function(error, savedBlog){
//                 if(error) console.log("error while liking blog >>> ", error)
//             })

//             // save user
//             foundUser.save(function(error, savedUser){
//                 if(error) console.log(error)
//                 res.json(savedUser)
//             })
//         })
//     })
// })

// EDIT ROUTE - might take out userId from params later, not sure
router.put('/:userId/:blogId', (req, res) => {
    console.log("In blog edit route...")
    console.log(req.params.blogId)
    console.log(req.body)
    Blog.findByIdAndUpdate(req.params.blogId, req.body, { new: true }, (error, updatedBlog) => {
        if(error) console.log("error while editing blog >> ", error)
        res.json(updatedBlog)
    })
})



// SHOW ROUTE
router.get('/:blogId', (req, res) => {
    console.log("inside blog show route...")
    Blog.findById(req.params.blogId, (error, foundBlog) => {
        if(error) console.log(error)
        res.json(foundBlog)
    })
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