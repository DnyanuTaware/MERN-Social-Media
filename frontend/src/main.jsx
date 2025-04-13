import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Login from "./components/Login.jsx";
// import Home from "./components/Home.jsx";
// import Register from "./components/Register.jsx";
// import ErrorPage from "./components/ErrorPage.jsx";
// import Practice from "./components/Practice.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import { PostContextProvider } from "./context/PostContext.jsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//       { path: "/home", element: <Home /> },
//       { path: "/login", element: <Login /> },
//       { path: "/register", element: <Register /> },
//       { path: "/practice", element: <Practice /> },
//     ],
//     errorElement: <ErrorPage />,
//   },
// ]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContextProvider>
      <PostContextProvider>
        {/* <RouterProvider router={router}></RouterProvider> */}
        <App />
      </PostContextProvider>
    </UserContextProvider>
  </StrictMode>
);
