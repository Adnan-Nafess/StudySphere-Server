import SubSection from "../models/SubSection.js";
import Section from "../models/Section.js";
import { uploadImageToCloudinary } from "../utils/imageUploader.js";

// createSubSection handler function
export const createSubSection = async (req, res) => {
  try {
    // fetch data
    const { sectionId, title, timeDuration, description } = req.body;
    const video = req.files.videoFile;

    // validation
    if (!sectionId || !title || !timeDuration || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create subsection
    const newSubSection = await SubSection.create({
      title,
      timeDuration,
      description,
      video: uploadDetails.secure_url,
    });

    // update section with new subsection
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subsections: newSubSection._id } },
      { new: true }
    );

    // use populate to get subsection details
  const populatedSection = await Section.findById(sectionId).populate("subsections");

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      section: populatedSection,
      updatedSection,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to create subsection",
      error: err.message,
    });
  }
};

// updateSubSection handler function
export const updateSubSection = async (req, res) => {
  try {
    // fetch data
    const { subsectionId, title, timeDuration, description } = req.body;

    // validation
    if (!subsectionId || !title || !timeDuration || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // update subsection
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      subsectionId,
      { title, timeDuration, description },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection updated successfully",
      subsection: updatedSubSection,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to update subsection",
      error: err.message,
    });
  }
};

// deleteSubSection handler function
export const deleteSubSection = async (req, res) => {
  try {
    // fetch subsectionId from request body
    const { subsectionId } = req.body;

    // validation
    if (!subsectionId) {
      return res.status(400).json({
        success: false,
        message: "SubSection ID is required",
      });
    }

    // delete subsection
    const deletedSubSection = await SubSection.findByIdAndDelete(subsectionId);

    // return response
    return res.status(200).json({
      success: true,
      message: "SubSection deleted successfully",
      data: deletedSubSection,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete subsection",
      error: err.message,
    });
  }
};
