import { Webhook } from "svix"
import User from "../models/userModel.js"
import Post from "../models/postModel.js"
import Comment from "../models/commentModel.js"

export const clerkWebHook = async (req, res) => {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
    if (!WEBHOOK_SECRET) {
        return res.status(400).json({ message: "Webhook secret is not set" })
    }

    const payload = req.body;
    const headers = req.headers;

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt;

    try {
        evt = wh.verify(payload, headers);
    } catch (err) {
        return res.status(400).json({
            message: "Webhook verification failed"
        });
    }

    if (evt.type === 'user.created') {
        try {
            const user = new User({
                clerkUserId: evt.data.id,
                username: evt.data.username || evt.data.email_addresses[0].email_address,
                email: evt.data.email_addresses[0].email_address,
                img: evt.data.profile_image_url || null
            })
            await user.save()
        } catch (error) {
        }
    }
    res.status(200).json({
        message: "Webhook processed successfully"
    });
}
