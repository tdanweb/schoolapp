import { Router } from "express";
import mongoose from "mongoose";

import express from "express";
import { getSettings, updatePost, updateSettings, addHoliday, addTerm, 
    getTermSettings, getAllTerms, addSubject, getAllSubjects, 
    addNewClass,
    getAllClass,
    admissionSettingUpdate,
    getAdmSettings,
    fetchHomePost
} from "../controllers/settings.js";

import upload2, { cloudinary } from "../cloudinaryMedia.js";
import { Teacher } from "../models/Staff.js";
import { HomeUpdate } from "../models/AppSettings.js";
import BlogPost from "../models/Post.js"
import { auth2 } from "../middlewares/auth.js";
import { fetchDashBoard, fetchOtherUserDashboard, getFeeInfo } from "../controllers/UserDataFetch.js";
import Applicant from "../models/Applicant.js";
import User from "../models/User.js";
const routes = express.Router();

routes.get("/setting", getSettings);


routes.put("/setting", 
   //auth2,
    updateSettings); //from auth get ...findById(req.userId)


routes.post("/setting-term", addTerm);
routes.get("/setting/terms", getAllTerms)
routes.put("/setting/post", updatePost)
//admission
routes.put("/setting/admission", admissionSettingUpdate)
routes.get("/settings/admission", getAdmSettings)

//subjects
routes.post("/setting/subject", addSubject);
routes.get("/setting/subjects", getAllSubjects)

// classrooms
routes.post("/classroom/add", addNewClass)
routes.get("/classrooms", getAllClass);





//borrowed routes for homepage posting
routes.post("/setting/home-post", async (req, res) => {
    const {regNo, content} = req.body;
    try {
       const check = await Teacher.findOne({ regNo }).select("displayName regNo staffType specialRoles");

       if(!check) return res.status(400).json({
        success: false, msg: "You are not authourized to make a post."
       });
/*
        if( (check.staffType !== "admin" && check.staffType !== "admin2" && check.staffType !== "chief-admin") ){
            return res.status(400).json({
                msg: "You don't have access to create a Post, Kindly Contact the Admin.." + check.staffType
            })
        };
*/
        const post = await HomeUpdate.create({
            ...req.body,
            poster: check.displayName,
            thisUser: "admin",
            content,
            imageUrl: "/poster2.jpg", //change to real ones later....
            imageId: "theasurus-boyss"
        });

        res.status(200).json({
            msg: "Your Post has been added!",
            post
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: "An Error occured in the Server..."})
    }
});


routes.get("/setting/home-posts", fetchHomePost)
routes.put("/setting/home-post/edit/:id", async(req, res) => {

    const {post, user} = req.body;
    
    try {
        const updatedPost = await HomeUpdate.findByIdAndUpdate(
            req.params.id,
            {content: post.content, title: post.title},
            {new: true}
        );

        res.status(200).json({
            msg: "Post Updated Successfully",
            post: updatedPost
        })
    } catch (error) {
        res.status(400).json({ msg: "Post update failed"})
    }
});

routes.delete("/setting/home-post/delete", async (req, res) => {
    try {
        const { id, user } = req.query;

        if (!id || !user) {
            return res.status(400).json({ message: "ID and user are required" });
        }

        await HomePost.findByIdAndDelete(id);

        res.status(200).json({ msg: "Post deleted successfully", success: true });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: error.message, success: false });
    }
});


routes.get("/setting/admin/dashboard-info", fetchDashBoard) //admin only

//other users
routes.get("/setting/user/dashboard-info/:id", fetchOtherUserDashboard);

// Homepage/BlogPost post
routes.post(
  "/setting/post/home/:id",
  upload2.array("images", 10), // maximum 10 images
  async (req, res) => {
    try {
      // =====================================================
      // 1. CHECK UPLOADED FILES
      // =====================================================

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          msg: "No images uploaded. Kindly select valid images.",
        });
      }

      // =====================================================
      // 2. GET USER
      // =====================================================

      const { regNo } = req.body;
      const {id} = req.params;
      //also check posting allowed in general Settings
      const savedUser = await User.findOne({_id: id, approved: true});

      const checkUser = await Teacher.findOne({ regNo: savedUser.regNo }).select(
        "staffId regNo staffType specialRoles _id"
      );

      if (!checkUser || !savedUser) {
        // Delete all uploaded images
        await Promise.all(
          req.files.map((file) =>
            cloudinary.uploader.destroy(file.filename, {
              resource_type: "image",
            })
          )
        );

        return res.status(404).json({
          success: false,
          msg: "Staff account not found.",
        });
      }

      // =====================================================
      // 3. CHECK AUTHORIZATION
      // =====================================================

      const isAdmin = [
        "admin",
        "chief-admin",
      ].includes(checkUser.staffType);

      const hasPostPermission = checkUser.specialRoles?.canCreateUpdate === true;

      const isAuthorized = isAdmin || hasPostPermission;

      if (!isAuthorized) {
        // Delete all uploaded images
        await Promise.all(
          req.files.map((file) =>
            cloudinary.uploader.destroy(file.filename, {
              resource_type: "image",
            })
          )
        );

        return res.status(403).json({
          success: false,
          msg: "Only Authorized Staff are allowed to make posts!",
        });
      }

      // =====================================================
      // 4. KEEP ONLY 5 HOMEPAGE POSTS
      // =====================================================

      const size = await BlogPost.countDocuments();

      if (size >= 20) {
        const oldestPost = await BlogPost.findOne()
          .sort({ createdAt: 1 });

        if (oldestPost) {
          // Delete ALL images belonging to old post
          if (oldestPost.images?.length) {
            await Promise.all(
              oldestPost.images.map((image) =>
                image.imgId
                  ? cloudinary.uploader.destroy(image.imgId, {
                      resource_type: "image",
                    })
                  : null
              )
            );
          }

          // Delete old post
          await BlogPost.deleteOne({
            _id: oldestPost._id,
          });
        }
      }

      // =====================================================
      // 5. PREPARE CLOUDINARY IMAGES
      // =====================================================

      const images = req.files.map((file) => ({
        imgUrl: file.path,
        imgId: file.filename,
      }));

      // =====================================================
      // 6. CREATE NEW POST
      // =====================================================

      const post = await BlogPost.create({
        ...req.body,
        posterId: savedUser._id,
        // Cloudinary information
        images,
        // User information
        thisUser: checkUser.staffType,
        poster: regNo,
      });

      // =====================================================
      // 7. CHECK CREATION
      // =====================================================

      if (!post) {
        // Delete all uploaded images
        await Promise.all(
          req.files.map((file) =>
            cloudinary.uploader.destroy(file.filename, {
              resource_type: "image",
            })
          )
        );

        return res.status(400).json({
          success: false,
          msg: "Post Creation Failed...",
        });
      }

      // =====================================================
      // 8. SUCCESS
      // =====================================================

      return res.status(201).json({
        success: true,
        msg: "Homepage post created successfully.",
        post,
      });

    } catch (error) {

      console.error(error);

      // =====================================================
      // CLEANUP ALL UPLOADED FILES
      // =====================================================

      if (req.files?.length) {
        try {
          await Promise.all(
            req.files.map((file) =>
              cloudinary.uploader.destroy(file.filename, {
                resource_type: "image",
              })
            )
          );
        } catch (cloudinaryError) {
          console.error(
            "Cloudinary cleanup failed:",
            cloudinaryError
          );
        }
      }

      return res.status(500).json({
        success: false,
        msg: "Server Error...",
      });
    }
  }
);


//fetching BlogPost
routes.get("/blog-posts", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find()
      .populate({
        path: "posterId",
        select: "fullname regNo",
      })
      .select({
        title: 1,
        posterId: 1,
        type: 1,
        images: 1,
        createdAt: 1,
        content: 1,
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const formattedPosts = posts.map((post) => {
      let excerpt = "";

      if (post.content) {
        excerpt = String(post.content)
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim();

        if (excerpt.length > 180) {
          excerpt = excerpt.substring(0, 180) + "...";
        }
      }

      return {
        _id: post._id,
        title: post.title,
        posterName: post.posterId?.fullname || "Unknown",
        posterRegNo: post.posterId?.regNo || null,
        type: post.type,
        images: post.images || [],
        createdAt: post.createdAt,
        excerpt,
      };
    });

    const totalPosts = await BlogPost.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.status(200).json({
      success: true,
      posts: formattedPosts,

      pagination: {
        currentPage: page,
        limit,
        totalPosts,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });

  } catch (error) {
    console.error("Fetch Blog Posts Error:", error);

    res.status(500).json({
      success: false,
      msg: "Unable to fetch blog posts",
    });
  }
});


routes.get("/blog-posts/:id",
  // auth here
  async (req, res) => {
    try {
      const { id } = req.params;

      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          msg: "Invalid post ID",
        });
      }




      const post = await BlogPost.findById(id)
        .populate({
          path: "posterId",
          select: "fullname regNo",
        })
        .lean();

      // Post doesn't exist
      if (!post) {
        return res.status(404).json({
          success: false,
          msg: "Blog post not found",
        });
      }

      res.status(200).json({
        success: true,
        msg: "Post fetched",
        post: {
          _id: post._id,
          title: post.title,
          content: post.content,
          posterName: post.posterId?.fullname || "Unknown",
          posterRegNo: post.posterId?.regNo || null,
          type: post.type,
          images: post.images || [],
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        },
      });

    } catch (error) {
      console.error("Fetch Single Blog Post Error:", error);

      res.status(500).json({
        success: false,
        msg: "Unable to fetch blog post",
      });
    }
  }
);


//
// School Fees

//get details
routes.get("/user/fee-info", getFeeInfo);


//va
export default routes;