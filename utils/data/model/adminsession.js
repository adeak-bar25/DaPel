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
        // if (!admininfo) throw new Error("Session tidak ditemukan");
        return admininfo.adminID;
    } catch (error) {
        throw error;
    }
};

// setTimeout(async () => console.log(await AdminSessionModel.getAdminID("4ae98284-f206-4d0a-9229-6fe555e33a6a")), 0);

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
