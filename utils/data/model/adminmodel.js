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


AdminSchema.statics.getHashByid = function(_id){
    return this.findOne({_id}).select('passwordHash -_id')
}

AdminSchema.statics.changePasswordHashById = function(_id, newHash){
    return this.updateOne({_id}, {passwordHash : newHash})
}

const Admin = mongoose.model('admin', AdminSchema)

export default Admin