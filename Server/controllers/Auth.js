import User from "../models/User.js";
import OTP from "../models/OTP.js";
import Profile from "../models/Profile.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
import { otpTemplate } from "../mail/template/emailVerificationTemplate.js";
import mailSender from "../utils/mailSender.js";

dotenv.config();

// sendOTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // Generate OTP
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    console.log("OTP generated:", otp);

    // Ensure OTP is unique
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    // Save OTP in DB
    await OTP.create({ email, otp });

    // Prepare email body using template
    const emailBody = otpTemplate(otp);

    // Send email
    await mailSender(email, "Your OTP for StudyNotion", emailBody);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log("Error in sendOTP:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// signUp
export const signUp = async (req, res) => {
  try {
    // data fetch from request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validation 
    if(!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
        return res.status(403).json({
            success: false,
            message: "All fields are required",
        });
    }

    // password match 
    if(password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password and ConfirmPassword value does not match, please try again,"
        })
    };

    // check user are already existing or not
    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.status(400).json({
            success: false,
            message: "User is already registered",
        });
    };

    // find most recent OTP stored for the user
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(recentOtp);

    // validate OTP
    if(recentOtp.length == 0) {
        // OTP not found
        return res.status(400).json({
            success: false,
            message: "OTP Not Found",
        })
    }else if(otp !== recentOtp[0].otp) {
        // Invalid OTP
        return res.status(400).json({
            success: false,
            message: "Invalid OTP",
        });
    };

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // entry created in DB

    const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
    });

    const user = await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return res
    return res.status(200).json({
        success: true,
        message: "User is registered Successfully",
        user,
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
        success: false,
        message: "User cannot be registered. Please try again",
    })
  }
};

// login
export const login = async (req, res) => {
    try {
        // get data from req body
        const { email, password } = req.body || {}; 
        
        // validation data
        if(!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required, please try again",
            });
        };

        // user check exist or not
        const user = await User.findOne({ email }).populate("additionalDetails");
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please signup first",
            });
        }

        // generate JWT, after Password matching
        if(await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            };

            const token = JWT.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })
            user.token = token;
            user.password = undefined;

            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly: true,
            };

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in Successfully",
            })
        }else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

    }catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Login failure please try again",
        })
    }
};