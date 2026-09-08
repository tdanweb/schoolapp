import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
reactionOpen: {
  type: Boolean,
  default: false,
},
    posterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Login",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: [String],
    content: {
      type: String,
      required: true,
      trim: true,
    },
    thisUser: String,
    type: {
      type: String,
      enum: ["blog", "events", "discussion", "award", "other"],
      default: "blog",
    },

    images: [
      {
        imgUrl: {
          type: String,
          trim: true,
        },

        imgId: {
          type: String,
          trim: true,
        },
      },
    ],

  },
  {
    timestamps: true,
  }
);

const BlogPost = new mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;


const shortUpdateSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150
        },

        body: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1000
        },

        poster: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
    },
    audience: [String]
  },
    {
        timestamps: true
    }
);


const ShortUpdate = mongoose.model("Short-post", shortUpdateSchema);
export { ShortUpdate };
