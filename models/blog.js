const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: String,
},{
    timestamps: true
})

const blogSchema = new mongoose.Schema({
    title: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    likes: {type: Number, default: 0},
    tags: String,
    comments: [commentSchema]

},{
    timestamps: true
})

const Blog = mongoose.model('Blog', blogSchema)
const Comment = mongoose.model('Comment', commentSchema)
module.exports = { Blog, Comment }