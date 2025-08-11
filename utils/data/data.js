import Student from './model/studentmodel.js';
import Admin from './model/adminmodel.js';
import SessionAdmin from './model/adminsession.js';


export {Admin, SessionAdmin, Student}

export async function addAdmin(name, passwordHash){
    try {
        const newAdmin = new Admin({ name, passwordHash})
        return await newAdmin.save()
    } catch (error) {
        throw error
    }
}

export async function checkTotalAdmin(){
    try {
        return await Admin.countDocuments()
    } catch (error) {
        throw error
    }
}

export async function getAdminInfo(name){
    try {
        return await Admin.findOne({name : name})
    } catch (error) {
        throw error  
    }
}

export async function getAllStudentData(){
    return await Student.find()
}

export async function addAdminSession(adminName, sessionUUID){
    try {
        let adminID = null
        try{
            const {_id} = await getAdminInfo(adminName)
            adminID = _id
        }catch(error){
            if(!adminID) throw `Username "${adminName}" is trying make session, but not found on database`
            throw error
        }
        const newSessionAdmin = new SessionAdmin({adminID , sessionUUID})
        return newSessionAdmin.save()
    } catch (error) {
        throw error
    }
}

