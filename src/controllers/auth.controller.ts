import validator from "validator";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse.utils";
import userMapper from "../mapper/userMapper";
import sendEmail from "../utils/sendEmail";
import { createToken, regToken } from "../utils/jwt.utils";

// Route for user login
const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("User not found!", 404));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorResponse("invalid credentials", 404));
    }
    const token = createToken(user._id);
    res.status(200).json({
      error: false,
      message: "Login successful",
      data: { authToken: token, user: userMapper(user) },
    });
  } catch (error) {
    console.log(error);
    next(new ErrorResponse("Error logging in!", 404));
  }
};

// Route for user register
const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // checking user already exists or not
    const exists = await User.findOne({ email });
    if (exists) {
      next(new ErrorResponse("User already exists!", 400));
    }

    // validating email format & strong password
    if (!validator.isEmail(email)) {
      next(new ErrorResponse("Please enter a valid email", 400));
    }
    // validate password length
    if (password.length < 8) {
      next(new ErrorResponse("Please enter a strong password", 400));
    }

    const newUser = new User({
      name,
      email,
      password,
    });

    const user = await newUser.save();

    const token = createToken(user._id);
    // send response
    res.status(201).json({
      error: false,
      message: "User registered successfully",
      data: { authToken: token, user: userMapper(newUser) },
    });
    const tokenReg = regToken(email);
    const message = `Click on the link below to verify your email: \n http://localhost:3000/verify?token=${tokenReg}`;
    // Send welcome email
    await sendEmail({
      email: newUser.email,
      subject: "Welcome on board!",
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { token } = req.params;
  try {
    if (!token) {
      return next(new ErrorResponse("Invalid token", 400));
    }
    if (!process.env.JWT_SECRET) {
      return next(new ErrorResponse("please provide secret", 400));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = (decoded as JwtPayload).email;
    const user = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    if (!user) {
      return next(new ErrorResponse("User not found!", 404));
    }
    res.status(200).json({
      error: false,
      message: "Email verified successfully!",
      data: user,
    });
  } catch (error) {
    return next(new ErrorResponse("invalid or expired token", 500));
  }
};

// const forgotPassword = async (req: Request, res: Response, next: NextFunction, email: string): Promise<void> => {
//   const userEmail = await User.findOne({email})
//   if(!userEmail) throw new ErrorResponse('email not found', 500)
//   const user = await User.findOne({email})
//   if(!user) throw new ErrorResponse('User not found', 404)

//   const token = crypto.randomBytes(20).toString('hex')
//   const hashedToken = createHash('sha256').update(token).digest('hex')

//   user.resetPasswordToken = hashedToken
//   user.resetPasswordTokenExpires = new Date(Date.now() + (10 * 60 * 1000))
//   await user.save()
//   const resetUrl = `https://localhost:3000/reset-password?token=${token}`
//   const message = `You are requesting this email because you (or someone else) requested to reset your password
//   on Heizz. If this was you, click on the link below to reset your password: \n ${resetUrl} \n
//    If you didn't initiate this request, please ignore this email.`

//   try {
//       await sendEmail({
//           email: user.email,
//           subject: 'Reset Password',
//           message
//       })
//   } catch (error) {
//       user.resetPasswordToken = undefined
//       user.resetPasswordTokenExpires = undefined
//       await user.save()
//       return next(new ErrorResponse('Error sending mail', 500)) ;
//   }

//   return next(new ErrorResponse("Password reset email sent!", 200))
// }

// export const handleForgotPassword = async (req: Request, res: Response) => {
//   const { email } = req.body;
//   const result = await forgotPassword(email);
//   res.status(200).json({ message: result, data: null, error: false });
// });

export { loginUser, registerUser };
