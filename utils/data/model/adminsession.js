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
    lastLogin : {
        type : Date,
        default : () => new Date(),
        expires : storeTimeCookieSec
    }
})

SessionSchema.statics.isAvailable = function(sessionUUID){
    this.find({
        sessionUUID : sessionUUID
    })
}
SessionSchema.statics.lastBeforeLatestLogin = async function(){
    try {
        let [data] = await this.find().sort({lastLogin : -1}).skip(1).limit(1)
        if(!data) data = await this.findOne()
        return data.lastLogin
    } catch (error) {
        throw error
    }
}

SessionSchema.methods.updateLoginDate = function(){
    this.lastLogin = new Date()
    return this.save()
}

const SessionAdmin = mongoose.model('SessionAdmin', SessionSchema)

export default SessionAdmin;