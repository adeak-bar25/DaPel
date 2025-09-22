import Admin from "./model/adminmodel.js";
import AdminSessionModel from "./model/adminsession.js";
import { DataModel } from "./model/dataModel.js";
import { SubmissionModel } from "./model/submissionModel.js";

export { Admin, AdminSessionModel, DataModel, SubmissionModel };

export async function addAdmin(name, passwordHash) {
    try {
        const newAdmin = new Admin({ name, passwordHash });
        return await newAdmin.save();
    } catch (error) {
        throw error;
    }
}

export async function getAdminInfo(name) {
    try {
        return await Admin.findOne({ name: name });
    } catch (error) {
        throw error;
    }
}

export async function getAllStudentData() {
    return await Student.find();
}
