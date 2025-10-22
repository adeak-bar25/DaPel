import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { saltRounds } from "../../../utils/config.js";
import { validatePassword } from "../../../utils/controller/auth.js";

export const infoSymAdmin = {
    notFound: Symbol("notfound"),
    duplicate: Symbol("duplicate"),
    wrong: Symbol("wrong")
};

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    lastLogin: {
        type: Date,
        default: () => Date.now()
    }
});

AdminSchema.statics.validateLogin = async function (admin) {
    const adminInfo = await this.findOne({ name: admin.name });
    if (!adminInfo) return infoSymAdmin.notFound;
    if (!(await validatePassword(admin.password, adminInfo.passwordHash))) {
        return infoSymAdmin.wrong;
    }
    return adminInfo._id;
};

AdminSchema.statics.getHashByid = function (_id) {
    return this.findOne({ _id }).select("passwordHash -_id");
};

AdminSchema.statics.changePasswordHashById = function (_id, newHash) {
    return this.updateOne({ _id }, { passwordHash: newHash });
};

AdminSchema.statics.getAllAdminName = async function () {
    const arrOfObj = await this.find().select("name -_id").exec();
    return arrOfObj.map((obj) => obj.name);
};

AdminSchema.statics.createNewAdmin = async function (name, password) {
    const usedName = await this.getAllAdminName();
    if (usedName.includes(name)) return infoSymAdmin.duplicate;

    const passwordHash = await bcrypt.hash(password, saltRounds);
    return this.create({ name, passwordHash });
};

const Admin = mongoose.model("admin", AdminSchema);

export default Admin;
