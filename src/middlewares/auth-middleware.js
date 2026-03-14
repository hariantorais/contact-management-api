const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user-respository");

const authMiddleware = async (req, res, next) => {
  // 1. ambil token
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized: Token tidak ditemukan!",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. verifikasi token

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 3. cari usr di database
    const currentUser = await userRepo.findFirst({
      where: { email: payload.email },
    });

    if (!currentUser) {
      return res.status(401).json({
        statu: "fail",
        message: "Unauthorized: User tidak ditemukan!",
      });
    }

    // 4. simpan data user ke objek request (sangat pengint!)
    const { password, ...userWithoutPassword } = currentUser;

    req.user = userWithoutPassword;

    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorize: token tidak valid atau sudah kadaluarsa",
    });
  }
};

module.exports = authMiddleware;
