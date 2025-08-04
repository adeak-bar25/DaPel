import mongoose from 'mongoose';
import Student from './studentmodel.js';
import Admin from './adminmodel.js';


// // Add one Data
// try{

//     console.log(await Student.find())

// const addOne = new Student({
//     name : 'aswatul fiki',
//     grade : 10,
//     class : "TKJ 1",
//     age: 17,
//     phone : "0812345678",
//     email: 'fiki@mail.com'
    
// })

// console.log(await addOne.save())
// }catch(err){
//     console.log(err.message)
// }

export async function addAdmin(name, passwordHash){
    console.log('Add To DB Check ✅')
    console.log(name, passwordHash)
    try {
        const newAdmin = new Admin({ name, passwordHash})
        return await newAdmin.save()
    } catch (error) {
        console.error(error.message)
    }
}

export async function checkTotalAdmin(){
    try {
        return await Admin.countDocuments()
    } catch (error) {
        console.error(error)
    }
}

export async function getAdminInfo(name){
    try {
        return await Admin.findOne({name : name})
    } catch (error) {
        console.error(error)   
    }
}
