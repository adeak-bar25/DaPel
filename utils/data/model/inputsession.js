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
    expiredAt: {
        type : Date,
        default : null,
        expires : 0,
        validate : {
            validator: v => v < new Date(),
            message: props =>  `Waktu Expire Harus Dimasa Depan!`
        }
    }
})

InputSessionSchema.statics.addNewSession = async function(grade, className, token, maxInput, expiredAt){
    try {
        const newInputSession = await this.create({grade, className, token, maxInput, expiredAt})
        newInputSession.save()
    } catch (error) {
        throw error
    }
}

const InputSession = mongoose.model('InputSession', InputSessionSchema)

export default InputSession;