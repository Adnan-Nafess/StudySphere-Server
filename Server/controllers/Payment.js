import { razorpay } from "../config/razorpay.js";
import Course from "../models/Course.js";
import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import { courseEnrollmentEmail } from "../mail/template/courseEnrollmentEmail.js";

// capturePayment handler function
export const capturePayment = async (req, res) => {
  // Check if user is authenticated
  // get user ID from request
  const { courseId } = req.body;
  const userId = req.user.id; // assuming user ID is available in req.user

  // Validate input
  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "Please provide course ID",
    });
  }

  // Find the course
  let course;
  try {
    course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the user is already enrolled in the course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(400).json({
        success: false,
        message: "User is already enrolled in this course",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to capture payment",
      error: err.message,
    });
  }

  // Order creation
  const amount = course.price;
  const currency = "INR";

  const options = {
    amount: amount * 100, // amount in smallest currency unit
    currency,
    receipt: `receipt_${new Date().getTime()}`,
    notes: {
      courseId: course._id.toString(),
      userId,
    },
  };

  try {
    // Initialize Razorpay 
    const order = await razorpay.orders.create(options);
    console.log("Order created:", order);
    if (!order) {
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }

    // Send response with order details
    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnail,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  }catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message,
    });
  };

};

// verify signature handler function
export const verifySignature = async (req, res) => {
  const webhookSecret = "123456789"; // replace with your actual webhook secret 
  
  const signature = req.headers["x-razorpay-signature"];

  const shasum = require("crypto").createHmac("sha256", webhookSecret)
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest("hex");

    if(signature === digest) {
        console.log("Payment is Authorized");

        const { courseId, userId, } = req.body.payload.payment.entity.notes;
       
        try {
            // full fill action
            const enrolledCourses = await Course.findOneAndUpdate(
                                            { _id: courseId },
                                            { $push: { studentsEnrolled: userId } }, // add userId to studentsEnrolled array
                                            { new: true } // return the updated document
                                           );

            if(!enrolledCourses) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found",
                });
            };

            console.log("User enrolled successfully in the course:", enrolledCourses);

            // find the student and added the course to their list enrolled Courses me
            const  enrolledStudent = await User.findByIdAndUpdate(
                { _id:userId },
                {$push: {courses: courseId}},
                { new: true } // return the updated document
            );

            console.log("User enrolled successfully in the course:", enrolledStudent);

            // send email to user
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "Course Enrollment Confirmation",
                courseEnrollmentEmail(enrolledCourses.courseName, enrolledStudent.name)
            );

            console.log("Email sent successfully:", emailResponse);

            // return response
            return res.status(200).json({
                success: true,
                message: "Payment verified and user enrolled successfully",
            });

        }catch (err) {
            console.log("Error enrolling user in course:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to enroll user in course",
                error: err.message,
            });
        }
    }else {
        console.log("Payment is Unauthorized");
        return res.status(400).json({
            success: false,
            message: "Payment verification failed",
        });
    }
};  
