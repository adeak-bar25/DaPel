import mongoose from "mongoose";
import { DataModel } from "./dataModel.js";

const SubmissionSchema = new mongoose.Schema({
    dataID: {
        type: Number,
        required: true
    },
    insFields: {
        type: Object,
        required: true
    }
});

SubmissionSchema.statics.insertSubmission = async function (token, insFields) {
    await DataModel.incrementInputCount(token);
    return this.create({
        insFields,
        token
    });
};

SubmissionSchema.statics.getAllSubmissionByDataID = async function (dataID) {
    return this.find({ dataID }).select("-_id -__v");
};

export const SubmissionModel = mongoose.model("submissions", SubmissionSchema);
