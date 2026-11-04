import jwt from "jsonwebtoken";
import User from "../models/User.js";

// authentication - xác minh user là ai, có quyền truy cập vào route hay không
// có 3 tham số vì next là middleware, nếu next() được gọi thì sẽ đi tiếp vào route,
//  nếu không thì sẽ dừng lại
export const protectedRoute = async (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // xác nhận token có hợp lệ hay không
    let decodedUser;
    try {
      decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      console.error(error);
      return res
        .status(403)
        .json({ message: "Access token hết hạn hoặc không hợp lệ" });
    }

    // tìm User
    const user = await User.findById(decodedUser.userId).select("-password"); // loại bỏ password khỏi dữ liệu trả về
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    // trả user về trong req
    req.user = user;
    next(); // đi tiếp vào route
  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
