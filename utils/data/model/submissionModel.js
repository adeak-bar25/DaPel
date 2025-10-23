import mongoose from "mongoose";
import { DataModel } from "./dataModel.js";
import AdminSessionModel from "./adminsession.js";

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

SubmissionSchema.statics.getLastSubmissionTime = async function (sessionUUID) {
    const tokenInfo = await DataModel.getAllTokenInfoByOwnerID(sessionUUID);
    if (tokenInfo === null || tokenInfo.length === 0) return null;
    const totalSubmission = tokenInfo.reduce((a, c) => c.currentInput + a, 0);
    if (totalSubmission === 0) return null;
    const [lastSubmission] = await this.find({ token: { $in: tokenInfo.map((e) => e.token) } })
        .sort({ _id: -1 })
        .limit(1);

    return lastSubmission._id.getTimestamp();
};

setTimeout(async () => console.log(await SubmissionModel.getLastSubmissionTime("fc314dd3-bd3e-40c3-94cc-0a9833721f2c")), 0);

export const SubmissionModel = mongoose.model("submissions", SubmissionSchema);
