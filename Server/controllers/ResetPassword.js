import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import bcrypt from "bcryptjs";


// resetPasswordToken
export const resetPasswordToken = async (req, res) => {
    try {
        // get email from req body
        const { email } = req.body;

        // check user for this email, email validation
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: "Your Email is not registered with us",
            });
        }

        // generate token
        const token = crypto.randomUUID();

        // update user by adding token and expiration time
        const updateDetails = await User.findOneAndUpdate({ email: email }, { token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, { new: true });

        // create url
        const url = `http://localhost:3000/update-password/${token}`;

        // send mail containing the url
        await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);

        // return response
        return res.json({
            success: true,
            message: "Email sent successfully, please check email and change password",
        });
    }catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password mail",
        });
    }
};


// resetpassword

export const resetPassword = async (req, res) => {
    try {
        // data fetched
        const { password, confirmPassword, token } = req.body;

        // validation
        if(password !== confirmPassword) {
            return res.json({
                success: false,
                message: "Password not matching",
            });
        }

        // get userDetails from db using token
        const userDetails = await User.findOne({ token: token });

        // if no entry - invalid token 
        if(!userDetails) {
            return res.json({
                success: false,
                message: "Token is invalid",
            });
        }

        // token time checking
        if(userDetails.resetPasswordExpires < Date.now()) {
            return res.json({
                success: false,
                message: "Token is expires, please regenerate your token",
            });
        }

        // password hash
        const hashedPassword = await bcrypt.hash(password, 10);

        // password update
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true },
        );

        // return response
        return res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });

    }catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while reset password mail",
        });
    }
}