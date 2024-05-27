var mongoose = require("mongoose");

var postSchema = mongoose.Schema(
    {
        // @AssetPlus: Describe schema here
        title:{
            type:String,
            required:true
        },
        poster:{
            type:String,
            required:true
        },
        author:{
            title:String,
            required:true
        },
        createdAy:{
            type:Date,
            default:Date.now,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Post", postSchema)