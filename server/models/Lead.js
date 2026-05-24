import mongoose from 'mongoose';

// Nested subdocument schema for notes
const noteSchema = new mongoose.Schema({
  content: { 
    type: String, 
    required: [true, 'Note content cannot be empty'], 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const leadSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Lead name is required'], 
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Lead email is required'], 
    lowercase: true, 
    trim: true 
  },
  phone: { 
    type: String, 
    trim: true 
  },
  company: { 
    type: String, 
    trim: true 
  },
  status: { 
    type: String, 
    enum: {
      values: ['New', 'Contacted', 'Converted'],
      message: 'Status must be either New, Contacted, or Converted'
    }, 
    default: 'New',
    index: true 
  },
  source: { 
    type: String, 
    default: 'Website',
    trim: true 
  },
  followUpDate: { 
    type: Date 
  },
  lastContacted: { 
    type: Date 
  },
  notes: [noteSchema], // Embedded subdocument array
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, { 
  timestamps: true // Automatically manages createdAt and updatedAt
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
