import { createContext, useContext, useEffect, useState } from "react";

import axios from "axios";
import toast from "react-hot-toast";

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  async function fetchPosts() {
    try {
      const { data } = await axios.get("/api/post/all");
      setPosts(data.posts);
      setReels(data.reels);
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }

  async function addPost(formData, setCaption, setFile, setFileprev, type) {
    setAddLoading(true);
    try {
      const { data } = await axios.post("/api/post/new?type=" + type, formData);

      toast.success(data.message);
      console.log(data);
      fetchPosts();
      setCaption("");
      setFile("");
      setFileprev("");
      setAddLoading(false);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      setAddLoading(false);
    }
  }
  async function likePost(id) {
    try {
      const { data } = await axios.post("/api/post/like/" + id);

      toast.success(data.message);
      console.log(data);
      fetchPosts();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function addComment(id, comment, setComment, setShow) {
    try {
      const { data } = await axios.post("api/post/comment/" + id, { comment });
      toast.success(data.message);
      fetchPosts();
      setComment("");
      setShow(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <PostContext.Provider
      value={{
        posts,
        reels,
        addPost,
        likePost,
        addComment,
        loading,
        addLoading,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const PostData = () => useContext(PostContext);
