const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (password !== admin.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not set in .env");
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, data: { id: admin._id, email: admin.email } });
  } catch (error) {
    console.error("Login Error:", error); // <-- log actual issue
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { loginAdmin };
