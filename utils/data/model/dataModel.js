import mongoose from "mongoose";
import validator from "validator";
import { customAlphabet } from "nanoid";
import { z, ZodError } from "zod";
import AdminSessionModel from "./adminsession.js";
import * as changeCase from "change-case";

import { generateVSchema } from "../../controller/validate.js";

// class FieldCore {
//     constructor(fieldName, type, isRequired) {
//         this.fieldName = fieldName;
//         this.type = type;
//         this.isRequired = isRequired;
//     }
// }

// class TextField extends FieldCore {
//     constructor(fieldName, isRequired, minLength) {
//         super(fieldName, "string", isRequired);
//         this.minLength = minLength;
//     }
// }

// class NumberField extends FieldCore {
//     constructor(fieldName, isRequired, min, max) {
//         super(fieldName, "number", isRequired);
//         this.min = min;
//         this.max = max;
//     }
// }

// class EnumField extends FieldCore {
//     constructor(fieldName, isRequired, options) {
//         super(fieldName, "enum", isRequired);
//         this.options = options;
//     }
// }

// class EmailField extends FieldCore {
//     constructor(fieldName, isRequired) {
//         super(fieldName, "email", isRequired);
//         validator: (v) => validator.isEmail(v);
//     }
// }

// class DateField extends FieldCore {
//     constructor(fieldName, isRequired) {
//         super(fieldName, "date", isRequired);
//     }
// }

// class PhoneNumberField extends FieldCore {
//     constructor(fieldName, isRequired) {
//         super(fieldName, "phone", isRequired);
//     }
// }

const tokenAlphabet = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM";
const nanoid = customAlphabet(tokenAlphabet, 6);

export const TokenStatInfo = {
    EXPIRED: Symbol("expired"),
    NOTFOUND: Symbol("notfound"),
    FULL: Symbol("full"),
    INVALID: Symbol("invalid"),
    OK: Symbol("ok")
};

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        default: () => nanoid(6)
    },
    expireAt: {
        type: Date,
        required: false,
        default: null
    },
    maxInput: {
        type: Number,
        required: true
    },
    currentInput: {
        type: Number,
        default: 0
    }
});

const DataSchema = new mongoose.Schema({
    ownerID: {
        type: String,
        required: true
    },
    formName: {
        type: String,
        required: true
    },
    fields: {
        type: Array,
        required: true
    },
    tokenInfo: {
        type: TokenSchema,
        required: true
    }
});

DataSchema.statics.newData = async function (ownerID, formName, fields, maxInput, expireAt) {
    return this.create({
        ownerID,
        formName,
        fields,
        tokenInfo: {
            maxInput,
            expireAt
        }
    });
};

DataSchema.statics.incrementInputCount = async function (token) {
    return this.updateOne({ "tokenInfo.token": token }, { $inc: { "tokenInfo.currentInput": 1 } });
};

DataSchema.statics.isTokenUsable = async function (token) {
    const val = z.coerce
        .string()
        .regex(new RegExp(`^[${tokenAlphabet}]{6}$`), TokenStatInfo.INVALID)
        .superRefine(async (val, ctx) => {
            const submissionInfo = await this.findOne({ "tokenInfo.token": val }).select(" -_id");
            if (!submissionInfo) {
                ctx.addIssue({
                    code: "custom",
                    message: TokenStatInfo.NOTFOUND
                });
                return;
            }
            if (submissionInfo.tokenInfo.expireAt !== null && submissionInfo.tokenInfo.expireAt < new Date()) {
                ctx.addIssue({
                    code: "custom",
                    message: TokenStatInfo.EXPIRED
                });
                return;
            }
            if (submissionInfo.tokenInfo.currentInput >= submissionInfo.tokenInfo.maxInput) {
                ctx.addIssue({
                    code: "custom",
                    message: TokenStatInfo.FULL
                });
                return;
            }
        });

    const final = await val.safeParseAsync(token);
    return { ok: final.success, error: final.error?.issues.map((e) => e.message) };
};

DataSchema.statics.getFieldByDataID = async function (_id) {
    const { fields } = await this.findOne({ _id }).select("fields -_id").exec();
    return fields;
};

DataSchema.statics.getDataInfoByToken = async function (token) {
    return this.findOne({ "tokenInfo.token": token }).select("-_id -__v").exec();
};

DataSchema.statics.getDataInfo = async function (sessionUUID) {
    return this.findOne({ ownerID: await AdminSessionModel.getAdminID(sessionUUID) }).exec();
};

DataSchema.statics.getAllDataBySessionUUID = async function (sessionUUID) {
    const datas = await this.find({ ownerID: await AdminSessionModel.getAdminID(sessionUUID) })
        .select("-_id -__v")
        .exec();
    if (datas.length === 0) return null;
    return datas;
};

DataSchema.statics.getEstimatedNumberBySessionID = async function (sessionUUID) {
    const datas = await this.find({ ownerID: await AdminSessionModel.getAdminID(sessionUUID) })
        .select("tokenInfo.maxInput tokenInfo.currentInput -_id")
        .exec();
    if (datas.length <= 0) return null;
    return datas.reduce(
        (a, c) => {
            return {
                maxInput: a.maxInput + c.tokenInfo.maxInput,
                currentInput: a.currentInput + c.tokenInfo.currentInput
            };
        },
        { maxInput: 0, currentInput: 0 }
    );
};

setTimeout(async () => console.log(await DataModel.getEstimatedNumberBySessionID("98273349-8d95-4acc-a100-24bc82eb3e65")), 0);

DataSchema.statics.getAllFormNameBySessionUUID = async function (sessionUUID) {
    const datas = await this.find({ ownerID: await AdminSessionModel.getAdminID(sessionUUID) })
        .select("formName")
        .exec();
    if (datas.length === 0) return null;
    return datas;
};

DataSchema.statics.getAllTokenInfoByOwnerID = async function (adminSessionUUID) {
    const datas = await this.find({ ownerID: await AdminSessionModel.getAdminID(adminSessionUUID) })
        .select("tokenInfo formName -_id")
        .lean()
        .exec();
    if (datas.length === 0) return null;

    return datas.map((e) => {
        const { ...data } = e.tokenInfo;
        return Object.assign({ formName: e.formName }, data);
    });
};

export const DataModel = mongoose.model("Data", DataSchema);
