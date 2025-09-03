import mongoose from "mongoose";
import { z, ZodError } from "zod";

const SubmissionSchema = new mongoose.Schema({
    dataID: {
        type : String,
        required : true
    },
    data: {
        type : Object,
        required : true
    },
    token: {
        type : String,
        required : true
    }
})

SubmissionSchema.statics.insertSubmission = async function(dataID, data, token){
    return this.create({dataID, data, token});
}

SubmissionSchema.statics.getAllSubmissionByDataID = async function(dataID){
    return this.find({dataID}).select("-_id -__v");
}

SubmissionSchema.statics.getAllSubmissionByToken = async function(token){
    return this.find({token}).select("-_id -__v");
}

export const Submission = mongoose.model("submissions", SubmissionSchema)

