import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/dashboard")));
const Try = Loadable(lazy(() => import("../pages/Try")));
const Postwork = Loadable(lazy(() => import("../pages/postwork")));
const Post = Loadable(lazy(() => import("../pages/Post")));
const Resume = Loadable(lazy(() => import("../pages/resume")));
const EditWork = Loadable(lazy(() => import("../pages/Post/edit")));
const CreateWork = Loadable(lazy(() => import("../pages/Post/create")));

const CreateResume = Loadable(lazy(() => import("../pages/resume/create")));
const EditResume = Loadable(lazy(() => import("../pages/resume/edit")));
//เพิ่ม
const ViewResume = Loadable(lazy(() => import("../pages/resume/view")));


const AdminRoutes = (isLoggedIn : boolean): RouteObject => {
  return {
    path: "/",
    element: isLoggedIn ? <FullLayout /> : <MainPages />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/t",
        element: <Try />,
      },
      {
        path: "/go",
        element: <Postwork />,
      },
      /*{

        path: "/p",

        element: <Post />,

      },*/
      {
        path: "/resume",
        children: [
          {
            path: "/resume",
            element: <Resume />,
          },
          {
            path: "/resume/create",
            element: <CreateResume />,
          },
          {
            path: "/resume/edit/:id",
            element: <EditResume />,
          },
          {
            path: "/resume/view/:id",
            element: <ViewResume />,
          }
        ],
      },
      {

        path: "/work",
        children: [
          {
            path: "/work",
            element: <Post />,
          },
          {

            path: "/work/create",

            element: <CreateWork />,

          },

          {

            path: "/work/edit/:id",

            element: <EditWork />,

          },

        ],

      },


    ],

  };

};


export default AdminRoutes;