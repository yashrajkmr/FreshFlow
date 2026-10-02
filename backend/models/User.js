// FreshFlow Mongoose Model - User & Store Manager Authentication
// Enforces schema validation, bcrypt password hashing, and role-based permissions
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long.']
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.']
    },
    name: {
      type: String,
      required: [true, 'Full name is required.'],
      trim: true
    },
    staffId: {
      type: String,
      required: [true, 'Staff ID is required.'],
      unique: true,
      trim: true,
      uppercase: true
    },
    role: {
      type: String,
      required: [true, 'Staff role is required.'],
      enum: {
        values: [
          'Store Operations Lead',
          'System Administrator',
          'Inventory Auditor',
          'Inventory Clerk',
          'Store Associate'
        ],
        message: '{VALUE} is not an authorized FreshFlow staff role.'
      },
      default: 'Store Operations Lead'
    },
    department: {
      type: String,
      default: 'Store Operations'
    },
    storeLocation: {
      type: String,
      default: 'Christ University Central Hub, Bangalore'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.password; // Never expose hashed password in JSON responses
        return ret;
      }
    }
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare plaintext password with stored hash
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
