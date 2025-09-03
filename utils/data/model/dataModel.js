import mongoose from "mongoose";
import validator from "validator"
import { TokenModel } from "./tokenModel.js";

import { generateVSchema } from "../../controller/validate.js";
import { formatError, string, ZodError } from "zod";


class FieldCore{
    constructor(fieldName, type, isRequired ){
        this.fieldName = fieldName
        this.type = type
        this.isRequired = isRequired
    }
} 

class TextField extends FieldCore{
    constructor(fieldName, isRequired, minLength){
        super(fieldName, "string", isRequired)
        this.minLength = minLength
    }
}

class NumberField extends FieldCore{
    constructor(fieldName, isRequired, min, max){
        super(fieldName, "number", isRequired)
        this.min = min
        this.max = max
    }
}

class EnumField extends FieldCore{
    constructor(fieldName, isRequired, options){
        super(fieldName, "enum", isRequired)
        this.options = options
    }
}

class EmailField extends FieldCore{
    constructor(fieldName, isRequired){
        super(fieldName, "email", isRequired)
        validator: (v) => validator.isEmail(v)
    }
}

class DateField extends FieldCore{
    constructor(fieldName, isRequired){
        super(fieldName, "date", isRequired)
    }
}

class PhoneNumberField extends FieldCore{
    constructor(fieldName, isRequired){
        super(fieldName, "phone", isRequired)
    }
}

const DataSchema = new mongoose.Schema({
    ownerID : {
        type : String,
        required : true
    },
    formName : {
        type : String,
        required : true
    },
    fields: {
        type : Array,
        required : true
    }
})


DataSchema.statics.getFieldByDataID = async function(_id){
    const {fields} = await this.findOne({_id}).select("fields -_id").exec()
    return fields
}

DataSchema.statics.getDataInfoByToken = async function(token){
    return this.findOne({_id : await TokenModel.getTokenDataID(token)})
        .select("-_id -__v").exec()
}


// setTimeout(async() => {
//     // Data.InsertSubmission("68ad06277f00d3aa9145bbf8", insertedData).then(res => console.log(res)).catch(err => console.log(err))
//     DataModel.getDataInfoByToken("757824")
//     .then(res => console.log(res))
//     .catch(err => console.log(err))
// }, 200)

// setTimeout(async() => {
//     new Data({
//         ownerId : "68ad06277f00d3aa9145bbf8",
//         formName : "Form Pertama",
//         field : [
//             new TextField("Nama", true, 3),
//             new NumberField("Umur", false, 1, 110),
//             new EnumField("Kelas", true, ["X", "XI", "XII"]),
//             new EmailField("Email", true)
//         ],
//         token : [{
//             token : "1234567890",
//             expireAt : new Date("2023-12-31T23:59:59.999Z")
            
//         }]
//     })
// }, 500)

export const DataModel = mongoose.model("Data", DataSchema)