import { getAdminInfo, addAdmin } from "./data/data.js";
import bcrypt from "bcrypt";

export async function authenticateAdmin(username, password){
    const admin = await getAdminInfo(username)
    console.log("Query From", username, "is", admin)
    if(!admin) return false
    console.log('Auth Check ✅')
    console.log(admin)
    return bcrypt.compare(password, await admin.passwordHash)
}

export async function createNewAdminAccount(username, password) {
    try {
        console.log('Auth Check ✅')
        console.log(username, password)
        await addAdmin(username, await hashPassword(password))
        console.log('New admin account created:', username);
    } catch (error) {
        console.error(error);
    }
}

function hashPassword(password){
    console.log('Hashing Check ✅')
    return bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))
}



