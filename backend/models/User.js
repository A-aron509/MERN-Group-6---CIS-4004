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
      required: function () {
        return !this.googleId; // only required for regular email/password accounts
      },
    },

    googleId: {
      type: String,
      unique: true,
      sparse: true, // lets many users have no googleId without a uniqueness conflict
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

    twoFactorEnabled: 
    {
      type: Boolean,
      default: false,
    },

    twoFactorSecret: 
    {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpires: {
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
