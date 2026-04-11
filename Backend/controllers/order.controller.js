import Razorpay from "razorpay";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import crypto from "crypto";
import {
  sendCourseConfirmationEmail,
  sendQuizConfirmationEmail,
  sendMockTestConfirmationEmail
} from "../utils/sendEmail.js";
import { CourseEnrollment } from "../models/courseEnrollment.model.js";
import { Coupon } from "../models/coupon.model.js";
import { MonthlyFee } from "../models/monthlyFee.model.js";
import { MockTestBundleEnrollment } from "../models/mockTestBundleEnrollment.model.js";
import { MockTestBundle } from "../models/mockTestBundle.model.js";

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  const { itemId, itemType, amount, mobileNumber, instituteName, presentCourseOfStudy } = req.body;

  try {
    // ✅ Validate itemType
    if (!itemType || !["course", "quiz", "mock_test_bundle"].includes(itemType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing itemType. Must be 'course' or 'quiz' or mock_test_bundle.",
      });
    }

    const options = {
      amount: Number(amount) * 100, // amount in paisa
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
      notes: {
        userId: req.user._id,
        itemType: itemType,
        itemId: itemId || "", // may be empty for quiz
      },
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({
        success: false,
        message: "Failed to create order",
      });
    }

    // ✅ Save order in DB
    const newOrder = new Order({
      userId: req.user._id,
      itemType,
      itemId,
      amount,
      razorpayOrderId: order.id,
      razorpayPaymentId: "", // will be updated after verification
      status: "Pending",
    });
    await newOrder.save();

    // ✅ Update user phone if provided
    if (mobileNumber) {
      await User.findByIdAndUpdate(
        req.user._id,
        { mobileNumber: mobileNumber },
        { new: true },
      );
    }

    // ✅ Update institute if provided
    if (instituteName) {
      await User.findByIdAndUpdate(
        req.user._id,
        { instituteName: instituteName },
        { new: true },
      );
    }

    if (presentCourseOfStudy) {
      await User.findByIdAndUpdate(
        req.user._id,
        { presentCourseOfStudy: presentCourseOfStudy },
        { new: true },
      );
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};



const verifyPayment = async (req, res) => {
  try {
    /* ================= SIGNATURE VERIFY ================= */

    const body = JSON.stringify(req.body);
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("Invalid signature");
      return res.status(200).json({ success: false });
    }

    const event = req.body;

    if (event.event !== "payment.captured") {
      return res.status(200).json({ success: true });
    }

    const payment = event.payload.payment.entity;

    /* ================= ORDER ================= */

    const order = await Order.findOne({
      razorpayOrderId: payment.order_id,
    });

    if (!order) {
      console.error("Order not found");
      return res.status(200).json({ success: false });
    }

    // IDPOTENCY CHECK (CRITICAL)
    if (order.status === "Completed") {
      return res.status(200).json({
        success: true,
        message: "Already processed",
      });
    }

    /* ================= USER ================= */

    const user = await User.findById(order.userId);

    if (!user) {
      console.error("User not found");
      return res.status(200).json({ success: false });
    }

    /* ================= COURSE ================= */

    if (order.itemType === "course") {
      const courseDetails = await Course.findById(order.itemId);

      if (!courseDetails) {
        console.error("Course not found");
        return res.status(200).json({ success: false });
      }

      // update user safely
      await User.updateOne(
        { _id: user._id },
        {
          $set: { isPremiumMember: true },
          $addToSet: { enrolledCourses: courseDetails._id }, // no duplicate
        }
      );

      // UPSERT enrollment (NO DUPLICATES EVER)
      await CourseEnrollment.updateOne(
        {
          courseId: courseDetails._id,
          userId: user._id,
        },
        {
          $setOnInsert: {
            courseId: courseDetails._id,
            userId: user._id,
          },
        },
        {
          upsert: true,
        }
      );

      // Monthly Fee (safe)
      if (courseDetails.mode?.toLowerCase() === "live") {
        const MONTH_KEYS = [
          "jan","feb","mar","apr","may","jun",
          "jul","aug","sep","oct","nov","dec"
        ];

        const now = new Date();
        const year = now.getFullYear();
        const month = MONTH_KEYS[now.getMonth()];

        await MonthlyFee.updateOne(
          {
            userId: user._id,
            courseId: courseDetails._id,
            year,
          },
          {
            $setOnInsert: {
              userId: user._id,
              courseId: courseDetails._id,
              year,
              startedFromMonth: month,
            },
          },
          { upsert: true }
        );
      }

      // send email ONCE
      await sendCourseConfirmationEmail({
        to: user.email,
        studentName: user.name,
        courseTitle: courseDetails.courseTitle,
        accessLink: `https://microdomeclasses.in/my-courses/${courseDetails._id}`,
        whatsappLink: courseDetails.whatsappLink,
      });
    }

    /* ================= QUIZ ================= */

    else if (order.itemType === "quiz") {
      await User.updateOne(
        { _id: user._id },
        { $set: { hasAccessToQuizzes: true } }
      );

      await sendQuizConfirmationEmail({
        to: user.email,
        studentName: user.name,
        quizLink: "https://microdomeclasses.in/quizzes",
      });
    }

    /* ================= MOCK TEST ================= */

    else if (order.itemType === "mock_test_bundle") {
      await MockTestBundleEnrollment.updateOne(
        {
          bundleId: order.itemId,
          userId: user._id,
        },
        {
          $setOnInsert: {
            bundleId: order.itemId,
            userId: user._id,
          },
        },
        { upsert: true }
      );

      const bundle = await MockTestBundle.findById(order.itemId);

      if (bundle) {
        await sendMockTestConfirmationEmail({
          to: user.email,
          name: user.name,
          mockTestBundleTitle: bundle.title,
          bundleId: bundle._id,
        });
      }
    }

    /* ================= FINAL ORDER UPDATE ================= */

    order.razorpayPaymentId = payment.id;
    order.status = "Completed";
    await order.save();

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      message: "Processed",
    });

  } catch (error) {
    console.error("Webhook error:", error);

    return res.status(200).json({
      success: false,
    });
  }
};

export const validateCouponCode = async (req, res) => {
  try {
    const { itemId, itemType, couponCode } = req.body;

    if (!itemId || !itemType || !couponCode) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Normalize coupon code
    const normalizedCode = couponCode.toLowerCase().trim();

    // 🔎 Find coupon by itemId + itemType + code
    const coupon = await Coupon.findOne({
      itemId,
      itemType,
      couponCode: normalizedCode,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",
      discount: coupon.discount,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};


export { createOrder, verifyPayment };
