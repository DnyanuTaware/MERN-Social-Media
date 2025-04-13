import React from "react";
import { BrowserRouter, Outlet, Routes, Route } from "react-router-dom";
import { UserData } from "./context/UserContext";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Account from "./Pages/Account";
import NavigationBar from "./components/NavigationBar";
import ErrorPage from "./Pages/ErrorPage";
import Reels from "./Pages/Reels";
import { Loading } from "./components/Loading";
import UserAccount from "./Pages/UserAccount";

const App = () => {
  const { loading, isAuth, user } = UserData();
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={isAuth ? <Home /> : <Login />} />
            <Route path="/reels" element={isAuth ? <Reels /> : <Login />} />
            <Route
              path="/account"
              element={isAuth ? <Account user={user} /> : <Login />}
            />
            <Route
              path="/user/:id"
              element={isAuth ? <UserAccount user={user} /> : <Login />}
            />
            <Route path="/login" element={!isAuth ? <Login /> : <Home />} />
            <Route
              path="/register"
              element={!isAuth ? <Register /> : <Home />}
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
          <NavigationBar />
        </BrowserRouter>
      )}
    </>
  );
};

export default App;
