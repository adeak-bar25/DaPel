import mongoose from "mongoose";
import { storeTimeCookieSec } from "../../config.js" 

const SessionSchema = new mongoose.Schema({
    adminID : {
        type : String,
        required : true,
    },
    sessionUUID : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : () => new Date(),
        expires : storeTimeCookieSec
    }
})

const SessionAdmin = mongoose.model('SessionAdmin', SessionSchema)

export default SessionAdmin;