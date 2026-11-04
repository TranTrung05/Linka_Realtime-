import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String, // link Cloudinary de hien thi hinh
    },
    avatarId: {
      type: String, // dung de xoa hinh tren Cloudinary
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    phone: {
      type: String,
      sparse: true, // cho phep null nhung van co the unique
    },
  },
  {
    timestamps: true, // tu dong tao createdAt va updatedAt
  },
);
// dòng này tạo ra một model User dựa trên schema userSchema, và model này sẽ được sử dụng để tương tác với collection "users" trong cơ sở dữ liệu MongoDB.
const User = mongoose.model("User", userSchema);
export default User;
