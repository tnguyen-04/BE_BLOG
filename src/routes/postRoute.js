import express from "express"
import { getAllPosts, getPostBySlug, createPost, deletePost, uploadAuth, featurePost } from "../controllers/postController.js"
import increaseVisit from "../middlewares/increaseVisit.js"

const router = express.Router()
router.get("/upload-auth", uploadAuth)
router.get("/", getAllPosts)
router.get("/:slug", increaseVisit, getPostBySlug)
router.post("/", createPost)
router.delete("/:id", deletePost)
router.patch("/feature", featurePost)
export default router