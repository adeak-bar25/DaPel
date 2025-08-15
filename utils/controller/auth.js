import { getAdminInfo, addAdmin, addAdminSession } from "../data/data.js";
import { saltRounds, storeTimeCookieSec } from '../config.js'
import bcrypt from "bcrypt";
import crypto from "crypto";

// console.log("Salt",saltRounds)

export async function authenticateAdmin(username, password){
    const admin = await getAdminInfo(username)
    if(!admin) return false
    return bcrypt.compare(password, admin.passwordHash)
}

export function isAdmin(res){
    if(!res.cookies.loginDapelSes) return false
    const sessionUUID = res.cookies.loginDapelSes
    try {
        
    } catch (error) {
        
    }
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
        console.log(adminName, sessionUUID)
        await addAdminSession(adminName, sessionUUID)
    } catch (error) {
        throw error
    }
    res.cookie('loginDapelSes', sessionUUID, { maxAge: parseInt(storeTimeCookieSec) * 1000, httpOnly: true })
}

function hashPassword(password){
    return bcrypt.hash(password, saltRounds)
}

function generateUUID(){
    return crypto.randomUUID()
}

export function generateInputToken(){
    return crypto.randomInt(100000, 999999)
}