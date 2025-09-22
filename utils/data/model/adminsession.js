import mongoose from "mongoose";
import { storeTimeCookieSec } from "../../config.js";
import { generateUUID } from "../../controller/auth.js";

const SessionSchema = new mongoose.Schema({
    adminID: {
        type: String,
        required: true
    },
    sessionUUID: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: () => new Date(),
        expires: storeTimeCookieSec
    }
});

SessionSchema.statics.sessionInfo = function (sessionUUID) {
    return this.findOne({ sessionUUID });
};

SessionSchema.statics.lastBeforeLatestLogin = async function () {
    try {
        let [data] = await this.find().sort({ lastLogin: -1 }).skip(1).limit(1);
        if (!data) data = await this.findOne();
        return data.lastLogin;
    } catch (error) {
        throw error;
    }
};

SessionSchema.statics.getAdminID = async function (sessionUUID) {
    try {
        const admininfo = await this.findOne({ sessionUUID }).select("adminID -_id");
        return admininfo?.adminID;
    } catch (error) {
        throw error;
    }
};

SessionSchema.statics.createNewSession = async function (adminID) {
    return await this.create({
        adminID,
        sessionUUID: generateUUID()
    });
};

SessionSchema.methods.updateLoginDate = function () {
    this.lastLogin = new Date();
    return this.save();
};

const AdminSessionModel = mongoose.model("AdminSession", SessionSchema);

export default AdminSessionModel;
