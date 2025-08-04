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

const Admin = mongoose.model('admin', AdminSchema)

export default Admin