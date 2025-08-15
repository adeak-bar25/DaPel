import mongoose from "mongoose";

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
        const newInputSession = await this.create({grade, className, token, maxInput, expireAt})
        return newInputSession.save()
    } catch (error) {
        throw error
    }
}

InputSessionSchema.statics.checkToken = function(token){
    return this.findOne({token})
}


const InputSession = mongoose.model('InputSession', InputSessionSchema)

InputSession.checkToken("")

export default InputSession;