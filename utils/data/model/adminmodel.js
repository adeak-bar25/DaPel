import mongoose from'mongoose';

const AdminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    }
})


AdminSchema.methods.updateLoginDate = function () {
    this.lastLogin = new Date()
    try {
        return this.save()
    } catch (error) {
        throw error
    }
}


const Admin = mongoose.model('admin', AdminSchema)



export default Admin