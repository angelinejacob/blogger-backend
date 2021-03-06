const router = require('express').Router()
const User = require('../models/user')
const { Blog } = require('../models/blog')
// const multer = require('multer')
// const path = require('path')
// var upload = multer({ dest: '../uploads'})

// to handle file uploads
// var storage = multer.diskStorage({
//     destination:function(req, file, cb){
//         cb(null, '../uploads')
//     },
//     filename:function(req, file, cb){
//         cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// })

// var upload = multer({ storage: storage })

// CREATE ROUTE
router.post('/',(req, res) => {
    // var obj = {
    //     name: req.body.name,
    //     username: req.body.username,
    //     password: req.body.password,
    //     bio: req.body.bio,
    //     img: req.body.img
    //     // img: {
    //     //     data: req.files.img.data.path,
    //     //     contentType: 'image/png'
    //     // }
    // }
    console.log("BODY >>> ", req.body)
    console.log('post route reached')
    User.create(req.body, (err, item) => {
        if(err){
            console.log("ERROR occured while creating user >>> ", err)
        } else {
            console.log("Created User >>> ", item)
            res.json(item)
        } 
    })
})

// READ ROUTE
router.get('/:id', async (req, res) => {
    let foundUser = await User.findById(req.params.id).populate('blogs')
    let blogs = []
    for(let i = 0; i < foundUser.blogs.length; i++){
        let newBlog = await Blog.findById(foundUser.blogs[i]).populate('author')
        blogs.push(newBlog)
    }
    let favoriteBlogs = []
    for(let i = 0; i < foundUser.favoriteBlogs.length; i++){
        let newBlog = await Blog.findById(foundUser.favoriteBlogs[i]).populate('author')
        favoriteBlogs.push(newBlog)
    }
    // let savedUser = await foundUser.save()

    // get all blogs in db
    let allBlogs = await Blog.find({}).populate('author')

    console.log("blogs >> ", blogs)

    res.json({ foundUser, blogs, favoriteBlogs, allBlogs })
        
})
    
    
    // User.findById(req.params.id, (error, foundUser) => {
    //     if(error){
    //         console.log("ERROR WHILE RETRIEVING USER >>> ", error)
    //     }
    //     else{
    //         res.json(foundUser)
    //     }
    // })
    


// EDIT ROUTE
router.put('/:id', (req, res) => {
    console.log("user edit route requested...")
    console.log(req.params.id)
    console.log(req.body)
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('blogs')
    .exec((error, updatedUser) => {
        if(error){
            console.log("ERROR WHILE UPDATING USER >>> ", error)
        }
        else {
            res.json(updatedUser)
        }
    })
    // User.findByIdAndUpdate(req.params.id, req.body, { new: true },(error, updatedUser) => {
    //     if(error){
    //         console.log("ERROR WHILE UPDATING USER >>> ", error)
    //     }
    //     else {
    //         res.json(updatedUser)
    //     }
    // })
})
module.exports = router