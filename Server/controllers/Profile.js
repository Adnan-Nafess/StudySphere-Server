import Profile from "../models/Profile.js";
import User from "../models/User.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

// updateProfile handler function
export const updateProfile = async (req, res) => {
  try {
    // fetch data
    const {
      gender,
      contactNumber,
      dateOfBirth = "",
      about = "",
    } = req.body || {};

    const id = req.user.id; // assuming user ID is available in req.user

    // validation
    if (!gender || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: "Gender and contact number are required",
      });
    }

    // find user by id
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

// deleteProfile handler function
export const deleteProfile = async (req, res) => {
  try {
    const id = req.user.id; // assuming user ID is available in req.user

    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // find user by ID
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // user enrolled in courses
    if (userDetails.enrolledCourses.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User cannot be deleted as they are enrolled in courses",
      });
    }

    // delete profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    await User.findByIdAndDelete(id);

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete profile",
      error: err.message,
    });
  }
};

// getProfile handler function
export const getProfile = async (req, res) => {
  try {
    const id = req.user.id; // assuming user ID is available in req.user

    // validation
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // find user by ID
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // find profile by userId
    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      profileDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: err.message,
    });
  }
};

// updateDisplayPicture handler function
export const updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ File check karo
    if (!req.files || !req.files.displayProfile) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const file = req.files.displayProfile;

    // ✅ Upload to Cloudinary
    const response = await uploadImageToCloudinary(
      file,
      "profileImages",
      500,
      90
    );

    // ✅ Update user image in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: response.secure_url },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating profile picture",
      error: err.message,
    });
  }
};

// getAllUserDetails handler function
export const getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
