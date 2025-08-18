import Student from './model/studentmodel.js';
import Admin from './model/adminmodel.js';
import AdminSession from './model/adminsession.js';
import InputSession from './model/studentinputsession.js';


export {Admin, AdminSession, Student, InputSession}

export async function addAdmin(name, passwordHash){
    try {
        const newAdmin = new Admin({ name, passwordHash})
        return await newAdmin.save()
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
        let adminID
        try{
            const {_id} = await getAdminInfo(adminName)
            adminID = _id
        }catch(error){
            if(!adminID) throw `Username "${adminName}" is trying make session, but username is not found on database`
            throw error
        }
        const newAdminSession = new AdminSession({adminID , sessionUUID})
        return newAdminSession.save()
    } catch (error) {
        throw error
    }
}

