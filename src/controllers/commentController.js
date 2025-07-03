import Comment from "../models/commentModel.js"
import User from "../models/userModel.js"
export const createComment = async (req, res) => {
    const clerkUserId = req.auth().userId
    if (!clerkUserId) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const { postId } = req.params
    const { desc } = req.body
    const user = await User.findOne({ clerkUserId })
    const comment = await Comment.create({ post: postId, desc, user: user._id })
    res.status(201).json(comment)
}

export const getPostComments = async (req, res) => {
    const { postId } = req.params
    const comments = await Comment.find({ postId }).populate('user', 'username img').sort({ createdAt: -1 })
    res.status(200).json(comments)
}
export const deleteComment = async (req, res) => {
    const clerkUserId = req.auth().userId
    if (!clerkUserId) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const role = req.auth.sessionClaims.metadata.role || 'user'
    if (role === 'admin') {
        await Comment.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: "Comment deleted successfully" })
    }
    const { id } = req.params
    const comment = await Comment.findByIdAndDelete(id, { user: clerkUserId })

    if (!comment) {
        return res.status(404).json({ message: "Comment not found or you are not authorized to delete this comment" })
    }
    res.status(200).json({ message: "Comment deleted successfully" })
}


