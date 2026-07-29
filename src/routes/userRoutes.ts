import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import type { User, CustomRequest } from "../libs/types.ts";

// import database
import { users, reset_users } from "../db/db.ts";

const router = Router();
const jwt_secret = process.env.JWT_SECRET || "hg8g3kfh8qgeivfg8";

// GET /api/v2/users
router.get("/", (req: Request, res: Response) => {
  try {
    // return all users
    return res.json({
      success: true,
      data: users,
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

// POST /api/v2/users/login
router.post('/login', (req: Request, res: Response) => {
  try {
    // 1. get username and password from body
    const { username, password } = req.body;

    if(!req.body){
        return res.status(400).json({
        success: false,
        message: 'Request Body is missing!',
      });
    }

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // 2. check if user exists (search with username)
    const foundUser = users.find((u) => u.username === username);

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: 'Username not found. please sign in.',
      });
    }

    // 3. check if password matches
    if (foundUser.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect Password',
      });
    }

    // Create JWT Payload dynamically using found user details
    const token = jwt.sign(
      {
        username: foundUser.username,
        studentId: foundUser.studentId || null,
        role: foundUser.role || 'USER',
        ip_address: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      },
      jwt_secret,
      { expiresIn: '30m' }
    );

    // 4. send HTTP response with JWT token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token,
    });
  } catch (err) {

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err,
    });
  }
});

// POST /api/v2/users/logout
router.post("/logout", (req: Request, res: Response) => {
  // 1. check Request if "authorization" header exists
  //    and container "Bearer ...JWT-Token..."

  // 2. extract the "...JWT-Token..." if available

  // 3. verify token using JWT_SECRET_KEY and get payload (username, studentId and role)

  // 4. check if user exists (search with username)

  // 5. proceed with logout process and return HTTP response
  //    (optional: remove the token from User data)

  return res.status(500).json({
    success: false,
    message: "POST /api/v2/users/logout has not been implemented yet",
  });
});

// POST /api/v2/users/reset
router.post("/reset", (req: Request, res: Response) => {
  try {
    reset_users();
    return res.status(200).json({
      success: true,
      message: "User database has been reset",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something is wrong, please try again",
      error: err,
    });
  }
});

export default router;