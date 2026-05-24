import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Admin name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Admin email is required'], 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: [true, 'Password is required']
  }
}, { 
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const User = mongoose.model('User', userSchema);

export default User;
