const mongoose = require('mongoose');


const PinSchema = new mongoose.Schema({
    username:{
        type:String,
        reqiure:true,
    },
    title:{
        type:String,
        reqiure:true,
        min:3
    },
    desc:{
        type:String,
        reqiure:true,
        min:3
    },
    rating:{
        type:String,
        require:true,
        min:0,
        max:5,
    },
    lat:{
        type:Number,
        require:true
    },
    long:{
        type:Number,
        require:true
    }
   
},{timestamps:true})


module.exports = mongoose.model("Pin",PinSchema)