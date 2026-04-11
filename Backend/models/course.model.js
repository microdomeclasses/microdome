import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema({
  courseTitle: {
    type: String,
    required: true,
  },

  courseDescription: {
    type: String,
    required: true,
  },

  subTitle: {
    type: String,
    required: true,
  },

  // keep for backward compatibility
  cardTitle: {
    type: String,
  },

  // legacy field (don't depend on this anymore)
  courseTag: {
    type: String,
  },

  // NEW (IMPORTANT)
  category: {
    type: String,
    enum: ["msc_entrance", "semester_course", "special"],
    required: true,
  },

  // NEW (optional)
  university: {
    type: String,
    lowercase: true,
    trim: true,
    default: null,
  },

  // NEW (flexible filtering)
  tags: {
    type: [String],
    default: [],
  },

  mode: {
    type: String,
    enum: ["live", "recorded"],
    required: true,
  },

  language: {
    type: String,
    required: true,
  },

  courseImage: {
    type: String,
    required: true,
  },

  actualPrice: {
    type: Number,
    required: true,
    min: 0,
  },

  discountedPrice: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function (value) {
        return value <= this.actualPrice;
      },
      message: "Discounted price cannot exceed actual price",
    },
  },

  // legacy field (don't depend on this anymore)
  linkAddress: {
    type: String,
  },

  whatsappLink: {
    type: String,
    required: true,
  },

  sections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
  ],

  isArchived: {
    type: Boolean,
    default: false,
  },

  isFeatured: {
    type: Boolean,
    default: false,
  },

  syllabusUrl: {
    type: String,
    default: null,
  },

  books: {
    type: [
      {
        title: String,
        url: String,
      },
    ],
    default: [],
  },
});

export const Course = mongoose.model("Course", courseSchema);
