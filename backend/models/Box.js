import mongoose from 'mongoose';

const boxSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  interval: {
    type: String,
    enum: ['monthly', 'quarterly'],
    default: 'monthly'
  }
}, {
  timestamps: true
});

const Box = mongoose.model('Box', boxSchema);
export default Box;