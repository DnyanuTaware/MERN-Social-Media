import React from "react";
import AddPost from "../components/AddPost";
import PostCard from "../components/PostCard";
import { PostData } from "../context/PostContext";
import { Loading } from "../components/Loading";

const Home = () => {
  const { posts, loading } = PostData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <div>Home</div>
          <AddPost type={"post"} />
          {posts && posts.length > 0 ? (
            posts.map((e) => <PostCard value={e} key={e._id} type={"post"} />)
          ) : (
            <p>No posts Yet</p>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
