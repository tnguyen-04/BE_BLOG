import User from "../models/userModel.js"
export const getSavedPosts = async (req, res) => {
    const clerkUserId = req.auth().userId
    if (!clerkUserId) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const user = await User.findOne({ clerkUserId })
    res.status(200).json(user.savedPosts)
}

export const savePost = async (req, res) => {
    const clerkUserId = req.auth().userId
    if (!clerkUserId) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const { postId } = req.body
    const user = await User.findOne({ clerkUserId })
    const isSaved = user.savedPosts.some((id) => id.toString() === postId)
    if (isSaved) {
        user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId)
        await user.save()
    } else {
        user.savedPosts.push(postId)
        await user.save()
    }
    setTimeout(() => {

        res.status(200).json(isSaved ? 'Post unsaved successfully' : 'Post saved successfully')
    }, 3000);
}