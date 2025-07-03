import express from 'express'
import { getSavedPosts, savePost } from '../controllers/userController.js'
const router = express.Router()

router.get('/saved', getSavedPosts)
router.patch('/save', savePost)

export default router