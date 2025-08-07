import { getAdminInfo, addAdmin, addAdminSession } from "./data/data.js";
import { saltRounds, storeTimeCookieSec } from './config.js'
import bcrypt from "bcrypt";

// console.log("Salt",saltRounds)

export async function authenticateAdmin(username, password){
    const admin = await getAdminInfo(username)
    if(!admin) return false
    return bcrypt.compare(password, admin.passwordHash)
}

export async function createNewAdminAccount(username, password) {
    try {
        console.log(username, password)
        await addAdmin(username, await hashPassword(password))
        console.log(`New admin account created, username : "${username}"`);
    } catch (error) {
        console.error(error);
    }
}

export async function createNewAdminSession(adminName, res){
    const sessionUUID = generateUUID()
    try {
        console.log(adminName, sessionUUID)
        await addAdminSession(adminName, sessionUUID)
    } catch (error) {
        throw error
    }
    res.cookie('login', sessionUUID, { maxAge: parseInt(storeTimeCookieSec) * 1000, httpOnly: true })
}

function hashPassword(password){
    return bcrypt.hash(password, saltRounds)
}

function generateUUID(){
    return crypto.randomUUID()
}
