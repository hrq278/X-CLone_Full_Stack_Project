import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text:{
        type: String,
    },
    image:{
        type: String
    },
    likes: [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    ],
    comments: [
        {
            text:{
                type: String,
                required: true
            },
            user:{
                type : mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        },
    ],
}
,{timestamps:true})

export const Post = mongoose.model("Post", postSchema)