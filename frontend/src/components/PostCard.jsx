import React, { useState, useEffect } from "react";
import { BsChatFill, BsThreeDotsVertical } from "react-icons/bs";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { UserData } from "../context/UserContext";
import { PostData } from "../context/PostContext";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const PostCard = ({ type, value }) => {
  const [isLike, setIsLike] = useState(false);
  const [show, setShow] = useState(false);
  const { user } = UserData();
  const { likePost, addComment } = PostData();

  const formatDate = format(new Date(value.createddAt), "MMM do");

  useEffect(() => {
    if (value.likes.includes(user.data._id)) {
      setIsLike(true);
    }
  }, [value, user.data._id]);

  const likeHandler = () => {
    setIsLike(!isLike);
    likePost(value._id);
  };
  const [comment, setComment] = useState("");

  const addCommentHandler = (e) => {
    e.preventDefault();
    addComment(value._id, comment, setComment, setShow);
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center p-3 pb-14">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
        <div className="flex items-center justify-between space-x-2">
          <Link to={`/user/${value.owner._id}`}>
            <div className="flex items-center space-x-2">
              <img
                src={value.owner.profilePic.url}
                alt=""
                className="w-8 h-8 rounded-full "
              />
              <div>
                <p className="text-gray-800 font-semibold ">
                  {value.owner.name}
                </p>
                <div className="text-gray-500 text-sm">{formatDate}</div>
              </div>
            </div>
          </Link>

          {value.owner._id === user.data._id && (
            <button className="hover:bg-gray-50 rounded-full p-1 text-2xl text-gray-500 cursor-pointer">
              <BsThreeDotsVertical />
            </button>
          )}
        </div>
        <div className="mb-4">
          <p className="text-gray-800 my-2">{value.caption}</p>
        </div>
        <div className="mb-4">
          {type === "post" ? (
            <img
              src={value.post.url}
              alt=""
              className="object-cover rounded-md"
            />
          ) : (
            <video
              src={value.post.url}
              alt=""
              className="object-cover rounded-md"
              autoPlay
              controls
            />
          )}
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <span
              onClick={likeHandler}
              className="text-red-500 text-2xl cursor-pointer"
            >
              {isLike ? <IoHeartSharp /> : <IoHeartOutline />}
            </span>
            <button className="hover:bg-gray-50 rounded-full p-1">
              {value.likes.length} likes
            </button>
          </div>
          <button
            onClick={() => setShow(!show)}
            className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
          >
            <BsChatFill />
            <span>{value.comments.length} comments </span>
          </button>
        </div>
        {show && (
          <form onSubmit={addCommentHandler} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Comment"
              className="custom-input"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="bg-gray-100 rounded-lg px-5 py-2">
              Add
            </button>
          </form>
        )}
        <hr className="mt-2 mb-2 " />
        <p className="text-gray-800  font-semibold">Comments</p>
        <hr className="mt-2 mb-2 " />
        <div className="mt-4"></div>
        <div className="comments max-h-[200px] overflow-y-auto">
          {value.comments && value.comments.length > 0 ? (
            value.comments.map((e) => (
              <Comment value={e} key={e._id} user={user} />
            ))
          ) : (
            <p>No Comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;

export const Comment = ({ value, user }) => {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <Link to={`/user/${value.user._id}`}>
        <img
          src={value.user.profilePic.url}
          className="size-8 rounded-full"
          alt=""
        ></img>
      </Link>
      <div>
        <p className="text-gray-800 font-semibold">{value.user.name}</p>
        <p className="text-gray-500 text-sm">{value.comment}</p>
      </div>
      {value.user._id === user.data._id && (
        <button className="text-red-500">
          <MdDelete />
        </button>
      )}
    </div>
  );
};
