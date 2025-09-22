import { getAdminInfo, addAdmin, AdminSessionModel, Admin } from "../data/data.js";
import { saltRounds, storeTimeCookieSec } from '../config.js'
import bcrypt from "bcrypt";
import crypto from "crypto";
import {TokenVSchema} from './validate.js';
import { object } from "zod";


export async function validatePassword(unValPass, passHash){
    return await bcrypt.compare(unValPass, passHash)
}

export async function createNewAdminAccount(username, password) {
    try {
        await addAdmin(username, await hashPassword(password))
    } catch (error) {
        console.error(error);
    }
}

export async function createNewAdminSession(adminID, res){
    try {
        adminID = typeof(adminID) === "object"? adminID.toString() : adminID
        const {sessionUUID} = await AdminSessionModel.createNewSession(adminID)
        return res.cookie('loginDapelSes', sessionUUID, {
            maxAge: parseInt(storeTimeCookieSec) * 1000,
            httpOnly: true,
            sameSite: "Strict"
        })
    } catch (error) {
        throw error
    }
}

export async function changePassword(sessionId, oldPassword, newPassword){
    const {adminID} = await AdminSessionModel.getAdminID(sessionId)
    const {["passwordHash"]: oldHash} = await Admin.getHashByid(adminID)
    
    if(!await bcrypt.compare(oldPassword, oldHash)) throw new Error("Password lama salah")

    const newHash = await hashPassword(newPassword)
    return await Admin.changePasswordHashById(adminID, newHash)
}

export async function cookieLogin(uuid){
    const s = await AdminSessionModel.sessionInfo(uuid)
    const session = s?? {}
    class Cookie{
        constructor(uuid){
            this.uuid = uuid
            this.dbDoc = session
            this.isValid = Object.keys(session).length > 0
        }
        setSessionCookie(res){
            res.cookie('tempSession', generateUUID(),{
                maxAge: 1000 * 60 * 60 * 5,
                httpOnly: true,
                sameSite: "Strict"
            })
            return this
        }
        async increaseCookieTime(res){
            this.dbDoc.updateLoginDate()
            res.cookie('loginDapelSes', this.uuid,{
                maxAge: parseInt(storeTimeCookieSec) * 1000,
                httpOnly: true,
                sameSite: "Strict"
            })
            return this
        }
    }

    return new Cookie(uuid)
}


function hashPassword(password){
    return bcrypt.hash(password, saltRounds)
}

export function generateUUID(){
    return crypto.randomUUID()
}

export function generateInputToken(){
    return crypto.randomInt(100000, 999999)
}