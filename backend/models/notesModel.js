import mongoose from "mongoose";

const notesSchema=new mongoose.Schema({
    heading:{
        type:String
    },
    id:{
        type:Number,
        required:true
    },
    content:{
        type:String
    },
    userId:{
        type:String ,
        required:true
    }
}, {
    timestamps:true
})

export const Notes= mongoose.model("Notes" , notesSchema);