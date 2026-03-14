const jwt = require("jsonwebtoken");
const userRepo = require("../repositories/user-respository");
const bcrypt = require("bcryptjs");
const {
  validate,
  registerUserValidation,
  loginUserValidation,
} = require("../utils/validation");

const register = async (request) => {
  const validRequest = validate(registerUserValidation, request);

  const countUser = await userRepo.count({
    where: { email: validRequest.email },
  });

  if (countUser === 1) {
    throw new Error("Email sudah terdaftar");
  }

  const hashedPassword = await bcrypt.hash(validRequest.password, 10);

  return userRepo.create({
    data: {
      name: validRequest.name,
      email: validRequest.email,
      password: hashedPassword,
    },
  });
};

const login = async (request) => {
  // 1. Validasi input
  const loginRequest = validate(loginUserValidation, request);

  // 2. Cari user di database
  const userData = await userRepo.findFirst({
    where: { email: loginRequest.email },
  });

  // Validasi user ada atau tidak
  if (!userData) {
    throw new Error("Email atau password salah!");
  }

  // 3. Cek password
  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    userData.password,
  );

  if (!isPasswordValid) {
    throw new Error("Email atau password salah!");
  }

  // 4. Generate token
  const token = jwt.sign(
    { id: userData.id, email: userData.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  return {
    name: userData.name,
    email: userData.email,
    token: token,
  };
};

module.exports = { register, login };
