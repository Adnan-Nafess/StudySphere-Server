import Section from '../models/Section.js';
import Course from '../models/Course.js';

// createSection handler function
export const createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;

        // validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // create section
        const newSection = await Section.create({ sectionName });

        // update course with new section (use courseContent, not sections)
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true }
        );

        // populate courseContent not 'Sections'
        const populatedCourse = await Course.findById(courseId).populate("courseContent");

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            course: populatedCourse,
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Failed to create section",
            error: err.message,
        });
    }
};


// updateSection handler function
export const updateSection = async (req, res) => {
    try {
        // fetch data
        const { sectionId, sectionName } = req.body;

        // validation
        if (!sectionId || !sectionName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        // update section
        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { sectionName },
            { new: true }
        );

        // return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// deleteSection handler function
export const deleteSection = async (req, res) => {
    try {
        // fetch data
        const { sectionId } = req.params;   

        // use findByIdAndDelete to delete section
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        // validation
        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found",
            });
        }

        // return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: deletedSection,
        });

    }catch(err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

