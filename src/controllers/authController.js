const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendResponse = require("../utils/response");

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return sendResponse(res, 409, false, "Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    sendResponse(res, 201, true, "User registered successfully", {
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      },
    );

    const refreshToken = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    user.refreshTokenHash = refreshTokenHash;
    await user.save();

    sendResponse(res, 200, true, "Login successfully", {
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshTokenHash) {
            return sendResponse(
                res,
                401,
                false,
                "Invalid refresh token"
            );
        }

        const isRefreshTokenValid = await bcrypt.compare(
            refreshToken,
            user.refreshTokenHash
        );

        if (!isRefreshTokenValid) {
            return sendResponse(
                res,
                401,
                false,
                "Invalid refresh token"
            );
        }

        const accessToken = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
        );

        sendResponse(
            res,
            200,
            true,
            "Access token refreshed successfully",
            {
                accessToken
            }
        );

    } catch (error) {
        return sendResponse(
            res,
            401,
            false,
            "Invalid or expired refresh token"
        );
    }
};

const logoutUser = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return sendResponse(
                res,
                400,
                false,
                "Refresh token is required"
            );
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshTokenHash) {
            return sendResponse(
                res,
                401,
                false,
                "Invalid refresh token"
            );
        }

        const isRefreshTokenValid = await bcrypt.compare(
            refreshToken,
            user.refreshTokenHash
        );

        if (!isRefreshTokenValid) {
            return sendResponse(
                res,
                401,
                false,
                "Invalid refresh token"
            );
        }

        user.refreshTokenHash = null;
        await user.save();

        return sendResponse(
            res,
            200,
            true,
            "Logout successful"
        );

    } catch (error) {
        return sendResponse(
            res,
            401,
            false,
            "Invalid or expired refresh token"
        );
    }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
};
