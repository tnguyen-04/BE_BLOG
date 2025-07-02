import express from "express"
import { getAllPosts, getPostBySlug, createPost, deletePost, uploadAuth } from "../controllers/postController.js"

const router = express.Router()
router.get("/upload-auth", uploadAuth)
router.get("/", getAllPosts)
router.get("/:slug", getPostBySlug)
router.post("/", createPost)
router.delete("/:id", deletePost)
export default router