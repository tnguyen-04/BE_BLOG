import Post from "../models/postModel.js"
import User from "../models/userModel.js"
import { clerkClient } from "@clerk/express"
import ImageKit from "imagekit"
export const createPost = async (req, res) => {
    const clerkUserId = req.auth().userId
    console.log("headers", req.headers)

    console.log('auth', req.auth())

    console.log('clerkUserId', clerkUserId)
    if (!clerkUserId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const user = await User.findOne({ clerkUserId })
    if (!user) {
        return res.status(401).json({
            message: "User not found"
        })
    }
    let slug = req.body.title.toLowerCase().replace(/ /g, '-')
    let existingPost = await Post.findOne({ slug })
    let count = 2
    while (existingPost) {
        slug = `${slug}-${count}`
        existingPost = await Post.findOne({ slug })
        count++
    }
    const newPost = new Post({ user: user._id, ...req.body, slug })
    await newPost.save()
    res.status(201).json(newPost)
}
export const getAllPosts = async (req, res) => {
    const posts = await Post.find()
    res.status(200).json(posts)
}
export const getPostBySlug = async (req, res) => {
    const { slug } = req.params
    const post = await Post.findOne({ slug })
    res.status(200).json(post)
}
export const deletePost = async (req, res) => {
    const clerkUserId = req.auth().userId
    if (!clerkUserId) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const user = await User.findOne({ clerkUserId })
    const deletedPost = await Post.findByIdAndDelete({ _id: req.params.id, user: user._id })
    if (!deletedPost) {
        return res.status(403).json({
            message: "Post not found or you are not authorized to delete this post"
        })
    }
    res.status(200).json({ message: "Post deleted successfully" })
}

const imageKit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
})
export const uploadAuth = async (req, res) => {
    console.log('publicKey', process.env.IMAGE_KIT_PUBLIC_KEY)
    console.log('privateKey', process.env.IMAGE_KIT_PRIVATE_KEY)
    console.log('urlEndpoint', process.env.IMAGE_KIT_URL_ENDPOINT)

    const { signature, expire, token } = await imageKit.getAuthenticationParameters()
    res.send({ signature, expire, token, publicKey: process.env.IMAGE_KIT_PUBLIC_KEY })
}