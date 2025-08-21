import mongoose, { set } from "mongoose";

const InputSessionSchema = new mongoose.Schema({
    grade : {
        type : Number,
        required: [true, "Kelas Tidak Boleh Kosong!"],
    },
    className : {
        type : String,
        required : [true, "Nama Kelas Tidak Boleh Kosong!"]
    },
    token : {
        type : String,
        required : [true, "Server tidak dapat mengenerate token!"]
    },
    maxInput : {
        type : Number,
        required : [true, "Jumlah Maksimal Input Tidak Boleh Kosong!"]
    },
    currentInput : {
        type : Number,
        default : 0
    },
    expireAt: {
        type : Date,
        default : null,
        expires : 0,
        validate : {
            validator: v => v? v > new Date(): true,
            message: props =>  `Waktu Expire Harus Dimasa Depan!`
        }
    }
})

InputSessionSchema.statics.addNewSession = async function(obj){
    const {grade, className, token, maxInput, expireAt} = obj
    try {
        return await this.create({grade, className, token, maxInput, expireAt})
    } catch (error) {
        throw error
    }
}

InputSessionSchema.statics.updateCurrent = function(token){
    return this.updateOne({token}, {$inc : {currentInput : 1}})
}

InputSessionSchema.statics.checkToken = function(token){
    return this.findOne({token : token})
}

InputSessionSchema.statics.inputAvailable = async function(token){
    const tokenInfo = await this.findOne({token : token})
    if(!tokenInfo) return null
    return tokenInfo.currentInput < tokenInfo.maxInput
}

const InputSession = mongoose.model('InputSession', InputSessionSchema)

export default InputSession;