import RatingAndReview from '../models/RatingAndReview.js';
import Course from '../models/Course.js';

// createRatingAndReview handler function
export const createRatingAndReview = async (req, res) => {
    try {
        // get user id 
        const userId = req.user._id;
        // Fetch Data from request body
        const { courseId, rating, review } = req.body;


        // check if course exists
        const course = await Course.findOne(
            { _id: courseId, studentEnrolled: {$elemMatch: {$eq: userId}} },
        );
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Student not enrolled in this course or course not found",
            });
        };

        // check if user already reviewed this course
        const alreadyReviewed = await RatingAndReview.findOne(
            { course: courseId, user: userId },
        );

        // creating rating and review
        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this course",
            });
        };

        // create new rating and review
        const newRatingAndReview = await RatingAndReview.create({
            course: courseId,
            user: req.user._id,
            rating,
            review,
        });


        // update course with new rating and review
        await Course.findByIdAndUpdate(
            courseId,
            { $push: { ratingAndReviews: newRatingAndReview._id } },
            { new: true }
        );

        // return response
        return res.status(201).json({
            success: true,
            message: "Rating and review created successfully",
            data: newRatingAndReview,
        });

    }catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error creating rating and review",
            error: err.message,
        });
    }
};

// getAverageRating handler function
export const getAverageRating = async (req, res) => {
    try {
        const courseId  = req.body.courseId;

        // calculate average rating for a course
        const result = await RatingAndReview.aggregate([
            {
                $match: { course: new mongoose.Types.ObjectId(courseId) },
            },
            {
                $group: {   
                    _id: null,
                    averageRating: { $avg: "$rating" }
                }
            }
        ]);

        // return response if ratings found
        if (result.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Average rating fetched successfully",
                data: { averageRating: result[0].averageRating },
            });
        };

        // if no ratings found, return 0
        return res.status(200).json({
            success: true,
            message: "No ratings found for this course",
            data: { averageRating: 0 },
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error fetching average rating",
            error: err.message,
        });
    }
};

// getAllRatingsAndReviews handler function
export const getAllRatingsAndReviews = async (req, res) => {
    try {
        // fetch all ratings and reviews for a course
        const ratingsAndReviews = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({
                path: "user",
                select: "firstName lastName profilePicture",
            })
            .populate({
                path: "course",
                select: "courseName thumbnail",
            })        
            .exec();

        // return response
        return res.status(200).json({
            success: true,
            message: "Ratings and reviews fetched successfully",
            data: ratingsAndReviews,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Error fetching ratings and reviews",
            error: err.message,
        });
    };
};