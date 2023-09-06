const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
     _id: String,
    user_firstName: {
        type: String,
        required: true,
    },
    user_lastName: {
        type: String,
        required: true,
    },
    user_mobileNumber: {
        type: Number,
        required: true,
    },
    user_email: {
        type: String,
        unique: true,
        required: true,
    },
    user_password: {
        type: String,
        required: true,
    },
    user_gender: { 
        type: String, 
        required: true 
    },
    user_role: {
        type: String,
        required: true 
    },
    user_status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
    user_approved: { 
        type: Boolean, 
        default: false },
}, { timestamps: true });

// Create a Counter schema for auto-incrementing IDs
const counterSchema = new mongoose.Schema({
    _id: { 
        type: String, 
        required: true 
    },
    sequenceValue: { 
        type: Number, 
        default: 100 
    }, // Initial value
});

const Counter = mongoose.model('user_id_counter', counterSchema);

// Create a function to auto-increment the _id field
userSchema.pre('save', function (next) {
    const user = this;
    Counter.findByIdAndUpdate(
      { _id: 'userId' }, // Use a specific document in the Counter collection for users
      { $inc: { sequenceValue: 1 } }, // Increment the sequenceValue
      { new: true, upsert: true } // Create the document if it doesn't exist
    )
      .then((counter) => {
        user._id = `U${counter.sequenceValue}`; // Add the "U" prefix
        next();
      })
      .catch((error) => {
        next(error);
      });
  });

module.exports = mongoose.model("user_profile", userSchema)