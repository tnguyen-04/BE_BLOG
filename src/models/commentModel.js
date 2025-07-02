import mongoose from "mongoose"

const commentSchema = mongoose.Schema({
    desc: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
}, { timestamps: true })


export default mongoose.model("Comment", commentSchema)