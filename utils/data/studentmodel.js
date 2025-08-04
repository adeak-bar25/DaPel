import mongoose from'mongoose';
import validator from "validator";

const studentSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        set : v => capitalizeName(v)
    },
    grade : {
        type : Number,
        required : true,
        min : 10,
        max : 12
    },
    class: {
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

function capitalizeName(name){
    return name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
}

const Student = mongoose.model('Student',studentSchema )

export default Student