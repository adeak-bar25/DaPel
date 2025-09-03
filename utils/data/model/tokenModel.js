import mongoose, { set } from "mongoose";
import { z, ZodError } from "zod";


const TokenSchema = new mongoose.Schema({
    token : {
        type : String,
        required : true
    },
    dataID: {
        type : String,
        required : true
    },
    expireAt: {
        type : Date,
        required : false,
        default : null
    },
    maxInput: {
        type : Number,
        required : true
    },
    currentInput: {
        type : Number,
        default : 0
    }
})


// setTimeout(async() => {
//     // Token.generateToken("68ad06277f00d3aa9145bbf8", 5, new Date(Date.now() + 3600000)).then(res => console.log(res))
//     // Token.incrementInputCount("990529").then(res => console.log(res))
//     const a = await Token.getTokenDataID(990529)
//     if(!a.success) console.log(a.errorMessages)
//     console.log(a)
// }, 200)

TokenSchema.statics.generateToken = function(obj){
    const {dataID, maxInput, expireAt} = obj
    console.log(expireAt)
    const token = Math.floor(100000 + Math.random() * 900000);
    const tokenDoc = new this({
        token,
        dataID,
        maxInput,
        expireAt : !expireAt || expireAt === ''? null : new Date(expireAt)
    })
    return tokenDoc.save()
}

TokenSchema.statics.validateToken = function(token){
    const val = z.coerce.number("Token harus berupa angka")
                .min(100000, "Token tidak valid")
                .max(999999, "Token tidak valid")
    try {
        return { success : true, data : val.parse(token) };
    } catch (err) {
        if(err instanceof ZodError) {
            return { success : false, error : err, errorMessages : err.issues.map(e => e.message)};
        }
        throw err;
    }
}

TokenSchema.statics.getTokenDataID = async function(token){
    const vtoken = this.validateToken(token)
    // console.log(vtoken)
    if(!vtoken.success) return vtoken
    const {dataID} = await this.findOne({ token : vtoken.data}).select("dataID -_id")
    return dataID
}

TokenSchema.statics.isUseAble = async function(token){
    class ResObj{
        constructor(success, errorMessages = null, errCode = null, data = null){
            this.success = success
            this.errorMessages = errorMessages
            this.errCode = errCode
            this.data = data
        }
    
    }

    const vToken = this.validateToken(token)
    if(!vToken.success) return new ResObj(false, vToken.errorMessages, "inval")

    const tokenDoc = await this.findOne({token : vToken.data})
    if(!tokenDoc) return new ResObj(false, "Token salah, silahkan cek kembali!", "wrong")

    if(tokenDoc.expireAt && tokenDoc.expireAt < new Date()) return new ResObj(false, "Token Expired, silahkan hubungi admin!", "expired")
    
    return new ResObj(true, null, null, tokenDoc.dataID)
}

TokenSchema.statics.getAllAvailableTokenFromDataID = async function(dataID){
    return this.find({dataID, currentInput : {$lt : "$maxInput"}}).select("token -_id")
}


TokenSchema.statics.incrementInputCount = function(token){
    return this.updateOne({token}, {$inc : {currentInput : 1}})
}

export const TokenModel = mongoose.model("tokens", TokenSchema)