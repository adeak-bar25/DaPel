import mongoose from "mongoose";
import validator from "validator"

import { generateVSchema } from "../../controller/validate.js";
import { formatError, ZodError } from "zod";


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
    ownerId : {
        type : String,
        required : true
    },
    formName: {
        type : String,
        required : true,
        set : v => v.trim()
    },
    field :{
        type : Array,
        required : true,
        default : [
            new TextField("Nama", true, 3),
            new NumberField("Umur", false, 1, 110),
            new EnumField("Jenis Kelamin", true, ["Pria", "Wanita"]),
            new EmailField("Email", true)
        ]
    },
    submissions: {
        type : Array,
        default : []
    }
})

DataSchema.methods.validateSubmission = function(data) {
    const Zval = generateVSchema(this.field);
    return Zval.parse(data);
};

DataSchema.statics.InsertSubmission = async function(id, data) {
    const doc = await this.findById(id);
    if (!doc) throw new Error("Form not found");

    let validatedData;

    try {
        validatedData = await doc.validateSubmission(data);
    } catch (error) {
        if(error instanceof ZodError) {
            return { ok : false , error : error.issues.map(e => e.message)};
        }
        throw error;
    }

    doc.submissions.push(validatedData.data);
    await doc.save();
    return { ok : true, data : doc }
};


// const insertedData = {
//     "Nama" : "John Doe",
//     "Email" : "adeakbarmagridinata@mail.com",
//     "Jenis Kelamin" : "Pria",
//     "Tanggal Lahir" : "2006-05-17",
//     "No. HP" : "081234567890",
//     "Tanggal Lahir" : new Date("2008-05-24T16:00:00.000Z"),
// }

// setTimeout(async() => {
//     Data.InsertSubmission("68ad06277f00d3aa9145bbf8", insertedData).then(res => console.log(res)).catch(err => console.log(err))
// }, 200)

export const Data = mongoose.model("Data", DataSchema)