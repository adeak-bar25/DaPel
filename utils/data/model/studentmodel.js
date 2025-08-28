import mongoose from'mongoose';
import validator from "validator";
import { InputSession } from '../data.js';

const StudentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        set : v => capitalizeName(v)
    },
    nisn: {
        type: String,
        required : true
    },
    grade : {
        type : Number,
        required : true,
        min : 10,
        max : 12
    },
    className: {
        type : String,
        require : true,
        uppercase: true,
    },
    age: {
        type : Number,
        min: 13,
        required : true
    },
    phone: {
        type: String,
        required : true,
        validate: {
            validator: (v) => validator.isMobilePhone(v, "id-ID"),
            message: (props) => console.error(`"${props.path} : ${props.value}" isn't a valid indonesian phone number!`)
        }
    },
    gender: {
        type: String,
        required : true,
        lowercase: true,
        enum : ["man", "woman"]
    },
    email: {
        type: String,
        required : true,
        validate: {
            validator: (v) => validator.isEmail(v)
        }
    },
    createAt : {
        type : Date,
        immutable : true,
        default : () => Date.now()
    },
    updateAt : {
        type : Date,
        default : () => Date.now()
    }
})

class Data{
    constructor(){
        createAt = () => Date.now()
        updateAt = () => Date.now()
    }

}

function capitalizeName(name){
    return name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

StudentSchema.statics.isDuplicate = async function(nisn){
    if(await this.findOne({nisn})) return true
    return false
}

StudentSchema.statics.getlastUpdated = async function(){
    const [latest] = await this.find().sort({updateAt : -1}).limit(1).select("updateAt -_id").exec()
    return latest
}

StudentSchema.statics.insertStudent = async function(studentData) {
    const {name, nisn, grade, className, age, phone, gender, email, token} = studentData;
    if(!await InputSession.inputAvailable(token)) return "Kuota input telah habis, silahkan hubungi admin"

    try {
        this.create({name, nisn, grade, className, age, phone, gender, email})
        await InputSession.updateCurrent(token)
        return "Success"
    } catch (error) {
        throw error
    }
}

StudentSchema.statics.deleteStudent = async function(id){
    try {
        await this.deleteOne({_id: id})
    } catch (error) {
        throw error
    }
}

const Student = mongoose.model('Student',StudentSchema )

export default Student


