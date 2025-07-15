import Tag from "../models/Tag.js";

// create Tag
export const createTag = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;

    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create entry in db
    const tagDetails = await Tag.create({
      name: name,
      description: description,
    });
    console.log(tagDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "Tag Created Successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// getAllTags handler function
export const showAllTags = async (req, res) => {
  try {
    const allTag = await Tag.find({}, { name: true, description: true });
    res.status(200).json({
      success: true,
      message: "All Tag returned successfully",
      allTag,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// tagDetails handler function
export const tagDetails = async (req, res) => {
  try {
    const { tagId } = req.body;

    // validation
    if (!tagId) {
      return res.status(400).json({
        success: false,
        message: "Tag ID is required",
      });
    }

    // fetch tag details
    const tagDetails = await Tag.findById(tagId)
                             .populate("courses")
                             exec();

 
    // if tag not found
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    };
    
    // get courses associated with the tag
    const diffrentTags = await Tag.find({
      _id: { $ne: tagId },
    })
    .populate("courses")
    .exec();


    // return response
    if (tagDetails) {
      return res.status(200).json({
        success: true,
        message: "Tag details fetched successfully",
        data: {
           tagDetails,
           diffrentTags,  
        }
      });

    } else {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};