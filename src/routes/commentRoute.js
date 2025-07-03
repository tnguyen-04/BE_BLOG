import express from "express"
import { createComment, getPostComments, deleteComment } from "../controllers/commentController.js"

const router = express.Router()
router.post("/:postId", createComment)
router.get("/:postId", getPostComments)
router.delete("/:id", deleteComment)
export default router   