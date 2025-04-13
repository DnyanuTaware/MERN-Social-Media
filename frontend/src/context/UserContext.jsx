import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState([]);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  async function registerUser(formData, navigate) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register", formData);
      console.log("data", data);

      toast.success(data.message);
      setUser(data);
      setIsAuth(true);
      setLoading(false);

      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }
  async function loginUser(email, password, navigate) {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", {
        email,
        password,
      });
      console.log("data", data);

      toast.success(data.message);
      setUser(data);
      setIsAuth(true);
      setLoading(false);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  }

  async function fetchUser() {
    setLoading(true);
    try {
      const data = await axios.get("/api/user/me");

      setUser(data); //data.user
      setIsAuth(true);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsAuth(false);
      setLoading(false);
    }
  }
  async function followUser(id, fetchUser) {
    try {
      const { data } = await axios.post("/api/user/follow/" + id);
      toast.success(data.message);
      fetchUser();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  useEffect(() => {
    fetchUser();
  }, []);

  async function logoutUser(navigate) {
    try {
      const { data } = await axios.get("/api/auth/logout");

      if (data.message) {
        toast.success(data.message);
        setUser([]);
        setIsAuth(false);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <UserContext.Provider
      value={{
        loginUser,
        isAuth,
        setIsAuth,
        user,
        setUser,
        loading,
        logoutUser,
        registerUser,
        followUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
