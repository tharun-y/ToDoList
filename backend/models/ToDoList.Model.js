import mongoose from 'mongoose' 

const userSchema = new mongoose.Schema({
    assignment :{
        type : String,
        required : true ,
    },
    Date : {
        type : String ,
        required : true ,
    },
    Status : {
        type : String ,
        required : true,
    },
}, {timestamps : true})

const ToDO = mongoose.model('ToDO',userSchema);
export default ToDO;