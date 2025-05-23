import { User } from "../models/userModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataURL from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";
import bcrypt from "bcrypt";

export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

export const userProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user)
    return res.status(400).json({
      message: "No user with this id",
    });
  res.json(user);
});

export const followandUnfollow = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id);
  const loggedInUser = await User.findById(req.user._id); //authenticated id of logeedin user

  if (!user) return res.status(400).json({ message: "No user with this Id" });

  if (user._id.toString() === loggedInUser._id.toString()) {
    return res.status(400).json({
      message: "You cant follow yourself",
    });
  }
  //to unfollow
  if (user.followers.includes(loggedInUser._id)) {
    const indexFollowing = loggedInUser.followings.indexOf(user._id);
    const indexFollower = user.followers.indexOf(loggedInUser._id);

    loggedInUser.followings.splice(indexFollowing, 1);
    user.followers.splice(indexFollower, 1);

    await loggedInUser.save();
    await user.save();

    res.json({
      message: "User Unfollowed",
    });
  } else {
    loggedInUser.followings.push(user._id);
    user.followers.push(loggedInUser._id);

    await loggedInUser.save();
    await user.save();

    res.json({
      message: "User Followed",
    });
  }
});

export const userFollowersAndFollowingData = TryCatch(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("followers", "-password")
    .populate("followings", "-password");
  const followers = user.followers;
  const followings = user.followings;

  res.json({
    followers,
    followings,
  });
});
//check if file is uploaded might cause error
export const updateProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { name } = req.body;

  if (name) {
    user.name = name;
  }

  const file = req.file;

  if (file) {
    const fileURL = getDataURL(file);

    const result = await cloudinary.v2.uploader.destroy(user.profilePic.id);
    console.log(result);

    const myCloud = await cloudinary.v2.uploader.upload(fileURL.content);

    user.profilePic.id = myCloud.public_id;
    user.profilePic.url = myCloud.secure_url;
  }
  console.log(file);
  await user.save();

  res.json({
    message: "Profile updated",
  });
});

export const updatePassword = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { oldPassword, newPassword } = req.body;

  const comparePassword = await bcrypt.compare(oldPassword, user.password);
  if (!comparePassword)
    return res.status(400).json({
      message: "wrong old password",
    });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({
    message: "Password Updated",
  });
});

export const getAllUsers = TryCatch(async (req, res) => {
  const search = req.query.search || "";
  const users = await User.find({
    name: {
      $regex: search,
      $options: "i",
    },
    _id: { $ne: req.user._id },
  }).select("-password");
  res.json(users);
});
