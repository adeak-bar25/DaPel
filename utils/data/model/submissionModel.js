import mongoose from "mongoose";
import { DataModel } from "./dataModel.js";

const SubmissionSchema = new mongoose.Schema({
    token: {
        type: String,
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

SubmissionSchema.statics.getAllSubmissionByToken = async function (token) {
    const data = await this.find({ token }).select("-token -_id -__v");
    if (data.length === 0) return null;
    return data.map((e) => e.insFields);
};

export const SubmissionModel = mongoose.model("submissions", SubmissionSchema);
