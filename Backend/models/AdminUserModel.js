import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const AdminUserSchema = new mongoose.Schema({
  aid: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  type: { 
    type: String,
    default: 'admin' 
  },
});

// Hash the password before saving the user
AdminUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash if the password is new or modified
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare hashed password
AdminUserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const AdminUser = mongoose.model('AdminUser', AdminUserSchema);

export default AdminUser;
