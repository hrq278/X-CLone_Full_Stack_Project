import mongoose, { model, Schema } from "mongoose";

const userSchema = new Schema(
    {
        fullName:{
            type:String,
            required: true,
        },
        username:{
            type:String,
            required: true,
            unique:true
        },
        email:{
            type:String,
            required: true,
            unique:true
        },
        password:{
            type:String,
            required: true,
        },
        bio:{
            type: String,
            default:""

        },
        link:{
            type: String,
            default:""
        },
        follower:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                default:[]
            }
        ], 
        following:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                default:[]
            }
        ],
        likedPosts:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Post",
                default:[]
            }
        ],

        profileImage:{
            type:String,
            default:""
        },
        coverImage:{
            type:String,
            default:""
        },
    
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema)
