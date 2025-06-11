const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyUser = require("../middleware/verifyUser");
const JWT_SECRET = process.env.JWT_SECRET;

const SALT_ROUNDS = 10;

// POST /user/register
router.post("/register", async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete: email and password are required.",
    });
  }

  try {
    const existingUser = await db("users").where({ email }).first();
    if (existingUser) {
      return res.status(409).json({
        error: true,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await db("users").insert({
      email: email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created",
    });
  } catch (err) {
    console.error("Error during /user/register:", err);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});



const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 60 * 60 * 1000 // 1時間
};

router.post("/login", async (req, res) => {
  const db = req.db;
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete: email and password are required.",
    });
  }

  try {
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ email: user.email, type: "Bearer"}, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign(
      { email: user.email, type: "Refresh" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Cookie にトークンを保存（JavaScript からアクセス不可）
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // クロスサイトでの使用を許可
      maxAge: 60 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7日間
    });
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("Error during /user/login:", err);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

router.post("/refresh", async (req, res) => {
  const db = req.db;
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete, refresh token required",
    });
  }
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const email = decoded.email;
    if (decoded.type !== "Refresh") {
      return res.status(401).json({
        error: true,
        message: "Invalid token type",
      });
    }
    const user = await db("users").where({ email }).first();

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({
        error: true,
        message: "Invalid or reused refresh token",
      });
    }
    await db("users").where({ email }).update({ refresh_token: "" });

    const bearerExpiresIn = 600;
    const refreshExpiresIn = 86400;

    const newBearerToken = jwt.sign(
      { email: email, type: "Bearer" },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const newrefreshToken = jwt.sign(
      { email: email, type: "Refresh" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    await db("users")
      .where({ email })
      .update({ refresh_token: newrefreshToken });

    res.cookie("token", newBearerToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: bearerExpiresIn * 1000,
    });

    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: refreshExpiresIn * 1000,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    if (err.name == "TokenExpiredError" || err.name == "JsonWebTokenError") {
      return res.status(401).json({
        error: true,
        message: "Invalid JWT token",
      });
    }
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

router.post("/logout", async (req, res) => {
  const db = req.db;
  const refreshToken  = req.cookies.refreshToken;
  // クッキーからリフレッシュトークンを取得

  if (!refreshToken) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete, refresh token required",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const email = decoded.email;
    const user = await db("users").where({ email }).first();

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({
        error: true,
        message:"JWT token has expired",
      });
    }

    await db("users").where({ email }).update({ refresh_token: "" });
    
    return res.status(200).json({
      error: false,
      message: "Token successfully invalidated",
    });
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError")
      return res.status(401).json({
        error: true,
        message:"Invalid JWT token",
      });
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});
//get user/{email}/profile
router.get("/:email/profile", verifyUser, async (req, res) => {
  const db = req.db;
  const { email } = req.params;

  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Email not provided",
    });
  }

  try {
    const user = await db("users")
      .select("email", "firstName", "lastName", "dob", "address")
      .where("email", email)
      .first();

    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // JWT decoded from cookie is already in req.user by verifyUser
    const isValid = req.user && req.user.email === email;

    return res.status(200).json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      ...(isValid && {
        dob: user.dob,
        address: user.address,
      }),
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});


//POST user/{email}/profile
router.put("/:email/profile", verifyUser, async (req, res) => {
  const db = req.db;
  const { firstName, lastName, dob, address } = req.body;
  const { email } = req.params;

  // 1. 入力チェック
  if (!firstName || !lastName || !dob || !address) {
    return res.status(400).json({
      error: true,
      message: "Request body incomplete: firstName, lastName, dob and address are required.",
    });
  }

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof dob !== "string" ||
    typeof address !== "string"
  ) {
    return res.status(400).json({
      error: true,
      message: "Request body invalid: all fields must be strings.",
    });
  }

  // 2. DOBバリデーション
  const dobDate = new Date(dob);
  const today = new Date();
  const minDate = new Date("1900-01-01");

  const isValidDate =
    /^\d{4}-\d{2}-\d{2}$/.test(dob) &&
    !isNaN(dobDate.getTime()) &&
    dob === dobDate.toISOString().slice(0, 10) &&
    dobDate <= today &&
    dobDate >= minDate;

  if (!isValidDate) {
    return res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a real past date in format YYYY-MM-DD.",
    });
  }

  // 3. クッキーから検証済みのユーザー情報
  const loggedInEmail = req.user?.email;
  if (loggedInEmail !== email) {
    return res.status(403).json({
      error: true,
      message: "Forbidden: You can only update your own profile.",
    });
  }

  try {
    // 4. ユーザー存在確認
    const user = await db("users").where("email", email).first();
    if (!user) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    // 5. 更新処理
    await db("users").where("email", email).update({
      firstName,
      lastName,
      dob,
      address,
    });

    // 6. 更新結果の取得と整形
    const updatedUser = await db("users")
      .select("email", "firstName", "lastName", "dob", "address")
      .where("email", email)
      .first();

    const plainUser = {
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      dob: new Date(updatedUser.dob).toISOString().slice(0, 10),
      address: updatedUser.address,
    };

    return res.status(200).json(plainUser);
  } catch (err) {
    console.error("Error during profile update:", err);
    return res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
});

module.exports = router;
