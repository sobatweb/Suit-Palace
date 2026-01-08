const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

// REGISTER
exports.register = async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: "username & password required" });
  }

  try {
    // Cek apakah username sudah ada
    const [existing] = await db.query(
      "SELECT id_admin FROM admins WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke DB
    await db.query(
      "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
      [username, hashedPassword]
    );

    res.status(201).json({ message: "Register success" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { username, password } = req.body || {};

  console.log("LOGIN BODY:", req.body);

  if (!username || !password) {
    return res.status(400).json({ message: "username & password required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM admins WHERE username = ?",
      [username]
    );

    console.log("DB RESULT:", rows);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const admin = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    

    // Generate JWT
    const token = jwt.sign(
      { id_admin: admin.id_admin, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
