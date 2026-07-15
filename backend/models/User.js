const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    fullName: 
    {
      type: String,
      required: true,
      trim: true,
    },
    
    email: 
    {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    password: 
    {
      type: String,
      required: true, // hashed, never stored in plain text
    },
   
    isVerified: 
    {
      type: Boolean,
      default: false,
    },
   
    verificationToken: 
    {
      type: String,
    },
    
    verificationTokenExpires: 
    {
      type: Date,
    },

    // --- Profile setup fields (used later, but defined now so we don't
    // have to migrate the schema again) ---
    height: { type: Number }, // in inches or cm — decide a unit and stick to it
    weightRange: { type: String },
    fitnessGoal: {
      type: String,
      enum: ['Lose Weight', 'Maintain Weight', 'Build Muscle'],
    },
    activityLevel: { type: String },
    weightliftingFrequency: { type: Number },
    cardioType: { type: String },
    cardioFrequency: { type: Number },
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
