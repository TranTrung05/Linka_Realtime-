import bcrypt from "bcrypt";
import User from "../models/User.js";
import Session from "../models/Session.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m"; // 30 phút
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

// ý nghĩa dòng là : Định nghĩa một hàm async gọi là signUp
// async hoạt động như sau
export const signUp = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      firstName,
      lastName,
      firstname,
      lastname,
    } = req.body;
    const normalizedFirstName = firstName ?? firstname;
    const normalizedLastName = lastName ?? lastname;
    if (
      !username ||
      !password ||
      !email ||
      !normalizedFirstName ||
      !normalizedLastName
    ) {
      return res.status(400).json({
        message:
          "Không thể thiếu Username, Password, Email, FirstName hoặc LastName",
      });
    }
    // Kiểm tra user đã tồn tại chưa
    const duplicate = await User.findOne({ username });
    if (duplicate) {
      return res.status(409).json({ message: "Username đã tồn tại" });
    }
    // mã hóa password
    const hashedPassword = await bcrypt.hash(password, 10); // nhờ có bcrypt mà password được mã hóa, 2^10 lần
    // càng chậm thì càng an toàn, nhưng cũng tốn thời gian hơn. 10 là mức độ bảo mật hợp lý

    // tạo user mới
    await User.create({
      username,
      password: hashedPassword,
      email,
      displayName: `${normalizedFirstName} ${normalizedLastName}`,
    });

    // return
    return res.sendStatus(204); // 204 là thành công nhưng không cần nội dung trả về
    // vì đây là signup nên không cần trả về gì cả, chỉ cần biết là thành công là được
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi đăng ký người dùng", error: error.message });
  }
};

export const signIn = async (req, res) => {
  try {
    // lấy inputs
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Thiếu Username hoặc Password" });
    }
    // lấy hashedPassword trong DB để so sánh với password mà user nhập vào
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Username không tồn tại" });
    }
    // Kiểm tra password
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Password không đúng" });
    }
    // nếu khớp -> tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );

    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex"); // tạo refresh token ngẫu nhiên, 64 bytes = 128 ký tự hex

    // tạo session mới để lưu refresh token vào DB
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL), // thời gian hết hạn của refresh token
    });

    // trả refresh token về trong cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // chỉ có thể truy cập cookie từ server, không thể truy cập từ client
      secure: true, // chỉ gửi cookie qua HTTPS
      sameSite: "none", // cho phép gửi cookie từ domain khác (cross-site)
      maxAge: REFRESH_TOKEN_TTL, // thời gian sống của cookie
    });

    // trả access token về trong res
    return res.status(200).json({
      message: `Người dùng ${user.displayName} đã đăng nhập thành công`,
      accessToken,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi đăng nhập", error: error.message });
  }
};

export const signOut = async (req, res) => {
  try {
    // Lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // Xóa refresh token trong session
      await Session.deleteOne({ refreshToken: token });
      // xóa cookie
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204); // 204 là thành công nhưng không cần nội dung trả về
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi đăng xuất", error: error.message });
  }
};
