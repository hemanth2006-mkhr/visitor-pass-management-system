import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const userSchema = new mongoose.Schema({
    employee : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Employee",
        default : null,
    },

    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
    },

    password : {
        type : String,
        required : true,
        minlength : 6,
        select : false,
    },

    role : {
        type : String,
        enum : Object.values(ROLES),
        required : true,
    },

    isActive : {
        type : Boolean,
        default : true,
    },

    lastLogin : {
        type : Date,
        default : null,
    }
},{
    timestamps : true,
})


const User = mongoose.model("User", userSchema)


export default User;