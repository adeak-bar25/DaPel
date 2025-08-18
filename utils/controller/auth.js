import { getAdminInfo, addAdmin, addAdminSession, InputSession, AdminSession } from "../data/data.js";
import { saltRounds, storeTimeCookieSec } from '../config.js'
import bcrypt from "bcrypt";
import crypto from "crypto";

// console.log("Salt",saltRounds)

export async function authenticateAdmin(username, password){
    const admin = await getAdminInfo(username)
    if(!admin) return false
    return bcrypt.compare(password, admin.passwordHash)
}

export async function createNewAdminAccount(username, password) {
    try {
        await addAdmin(username, await hashPassword(password))
    } catch (error) {
        console.error(error);
    }
}

export async function createNewAdminSession(adminName, res){
    const sessionUUID = generateUUID()
    try {
        await addAdminSession(adminName, sessionUUID)
    } catch (error) {
        throw error
    }
    res.cookie('loginDapelSes', sessionUUID, {
        maxAge: parseInt(storeTimeCookieSec) * 1000,
        httpOnly: true,
        sameSite: "Strict"
    })
}

export async function cookieLogin(uuid){
    const s = await AdminSession.sessionInfo(uuid)
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
            console.log("cookie is up")
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