const router = require('express').Router()
const User = require('../models/user')
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
    var obj = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        bio: req.body.bio,
        // img: {
        //     data: req.files.img.data.path,
        //     contentType: 'image/png'
        // }
    }
    // User.create(obj, (err, item) => {
    //     if(err){
    //         console.log("ERROR occured while creating user >>> ", err)
    //     } else {
    //         console.log("Created User >>> ", item)
    //     } 
    // })
    console.log("BODY >>> ", req.body)
    console.log("FILE PATH >>> ", req.files.img)
    console.log("OBJ >>> ", obj)
    console.log('post route reached')
})

// test route
router.get('/', (req, res) => {
    res.send('Get a user route')
})

module.exports = router