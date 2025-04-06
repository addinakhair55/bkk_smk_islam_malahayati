import { lazy } from "react";
import { Navigate } from "react-router-dom";
import Loadable from "../layouts/full/shared/loadable/Loadable";

// Role Admin
import UpdateTracerStudy from "../components/dashboard/admin/TracerStudy/update";
import DetailTracerStudy from "../components/dashboard/admin/TracerStudy/detail";
import DetailInfoLoker from "../components/dashboard/admin/Loker/detail";
import UpdateInfoLoker from "../components/dashboard/admin/Loker/update";
import UpdateMouPerusahaan from "../components/dashboard/admin/Perusahaan/Mou/update";
import CreateTracerStudy from "../components/dashboard/admin/TracerStudy/create";
import CreateMouPerusahaan from "../components/dashboard/admin/Perusahaan/Mou/create";
import CreateInfoLoker from "../components/dashboard/admin/Loker/create";
import DetailMouPerusahaan from "../components/dashboard/admin/Perusahaan/Mou/detail";

// Role Alumni
import TracerStudyFormAdd from "../components/dashboard/alumni/TracerStudy/TracerStudyFormAdd";
import TracerStudyAlumni from "../components/dashboard/alumni/TracerStudy/TracerStudyAlumni";
import TracerStudyEditAlumni from "../components/dashboard/alumni/TracerStudy/TracerStudyEditAlumni";

// Role Perusahaan
import LoginPerusahaan from "../views/authentication/page/LoginPerusahaan";
import RegisterPerusahaan from "../views/authentication/page/RegisterPerusahaan";
import CreateInfoLokerPerusahaan from "../components/dashboard/perusahaan/Loker/create/CreateInfoLokerPerusahaan";
import InfoLokerPerusahaan from "../components/dashboard/perusahaan/Loker/InfoLokerPerusahaan";
import DetailInfoLokerPerusahaan from "../components/dashboard/perusahaan/Loker/detail/DetailInfoLokerPerusahaan";
import UpdateInfoLokerPerusahaan from "../components/dashboard/perusahaan/Loker/update/UpdateInfoLokerPerusahaan";

// Auth Admin & Alumni
import ForgotPasswordAdmin from "../views/authentication/page/ForgotPassword";
import ResetPasswordAdmin from "../views/authentication/page/ResetPassword";
import ForgotPasswordPerusahaan from "../views/authentication/page/ForgotPasswordPerusahaan";
import ResetPasswordPerusahaan from "../views/authentication/page/ResetPasswordPerusahaan";

// Private Route
import PrivateRoute from "./PrivateRoute";

// Landing Page
import Home from "../views/landingPage/home";
import VisiMisi from "../views/landingPage/component/VisiMisi";
import TracerStudyView from "../views/landingPage/component/TracerStudyView";
import InfoLokerView from "../views/landingPage/component/InfoLokerView";
import ProgramKerja from "../views/landingPage/component/ProgramKerja";
import KontakView from "../views/landingPage/component/KontakView";
import DetailInfoLokerView from "../views/landingPage/component/DetailInfoLokerView";
import GaleriKegiatanView from "../views/landingPage/component/GaleriKegiatanView";
import FaqView from "../views/landingPage/component/FaqView";

// Dashboard Layout
import DashboardLayout from "../layouts/full/DashboardLayout";
import DashboardAlumni from "../views/dashboard/DashboardAlumni";
import DashboardPerusahaan from "../views/dashboard/DashboardPerusahaan";
import Profile from "../views/authentication/page/Profile";
import KonfirmasiGabung from "../views/authentication/page/KonfirmasiGabung";


/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import("../layouts/full/FullLayout")));
const BlankLayout = Loadable(lazy(() => import("../layouts/blank/BlankLayout")));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import("../views/dashboard/Dashboard")));
const TracerStudy = Loadable(lazy(() => import("../views/dashboard/components/TracerStudy")));
const MouPerusahaan = Loadable(lazy(() => import("../views/dashboard/components/MouPerusahaan")));
const InfoLoker = Loadable(lazy(() => import("../views/dashboard/components/InfoLoker")));
const Error = Loadable(lazy(() => import("../views/authentication/Error")));
const RegisterAdmin = Loadable(lazy(() => import("../views/authentication/page/Register")));
const LoginAdmin = Loadable(lazy(() => import("../views/authentication/page/Login")));

const Router = [
  // Landing Page Routes
  { path: "/", element: <Home /> },
  { path: "/visi-misi", element: <VisiMisi /> },
  { path: "/program-kerja", element: <ProgramKerja /> },
  { path: "/tracer-study", element: <TracerStudyView /> },
  { path: "/info-loker", element: <InfoLokerView /> },
  { path: "/info-loker/:id", element: <DetailInfoLokerView /> },
  { path: "/galeri-kegiatan", element: <GaleriKegiatanView /> },
  { path: "/faq", element: <FaqView /> },
  { path: "/kontak", element: <KontakView /> },
  { path: "/layout", element: <DashboardLayout /> },
  { path: "/fulllayout", element: <FullLayout /> },

  // Dashboard Admin Routes
  { 
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute requiredRole="admin">
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/tracerStudy",
        element: (
          <PrivateRoute requiredRole="admin">
            <TracerStudy />
          </PrivateRoute>
        ),
      },
      {
        path: "/info-lowongan-kerja",
        element: (
          <PrivateRoute requiredRole="admin">
            <InfoLoker />
          </PrivateRoute>
        ),
      },
      {
        path: "/detailLowongan/:id",
        element: (
          <PrivateRoute requiredRole="admin">
            <DetailInfoLoker />
          </PrivateRoute>
        ),
      },
      {
        path: "/editLowongan/:id",
        element: (
          <PrivateRoute requiredRole="admin">
            <UpdateInfoLoker />
          </PrivateRoute>
        ),
      },
      {
        path: "/createInfoLowonganKerja",
        element: (
          <PrivateRoute requiredRole="admin">
            <CreateInfoLoker />
          </PrivateRoute>
        ),
      },
      {
        path: "/createTracerStudy",
        element: (
          <PrivateRoute requiredRole="admin">
            <CreateTracerStudy />
          </PrivateRoute>
        ),
      },
      {
        path: "/editTracerStudy/:id",
        element: (
          <PrivateRoute requiredRole="admin">
            <UpdateTracerStudy />
          </PrivateRoute>
        ),
      },
      {
        path: "/detailTracerStudy/:id",
        element: (
          <PrivateRoute requiredRole="admin">
            <DetailTracerStudy />
          </PrivateRoute>
        ),
      },
      {
        path: "/mou-perusahaan",
        element: (
          <PrivateRoute requiredRole="admin">
            <MouPerusahaan />
          </PrivateRoute>
        ),
      },
      {
        path: "/createMouPerusahaan",
        element: (
          <PrivateRoute requiredRole="admin">
            <CreateMouPerusahaan />
          </PrivateRoute>
        ),
      },
      {
        path: "/editMouPerusahaan/:id",
        element: (
          <PrivateRoute requiredRole="admin">
            <UpdateMouPerusahaan />
          </PrivateRoute>
        ),
      },
      {
        path: "/detailMouPerusahaan/:id",
        element: (
          <PrivateRoute requiredRole="admin">
            <DetailMouPerusahaan />
          </PrivateRoute>
        ),
      },      
      ],
    },
  // Dashboard Alumni Routes
  {
      path: "/",
      element: <DashboardLayout />,
      children: [
      {
        path: "/alumni",
        element: (
          <PrivateRoute requiredRole="alumni">
            <DashboardAlumni />
          </PrivateRoute>
        ),
      },
      {
        path: "/add-form-tracer-study",
        element: (
          <PrivateRoute requiredRole="alumni">
            <TracerStudyFormAdd />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-tracer-study",
        element: (
          <PrivateRoute requiredRole="alumni">
            <TracerStudyAlumni />
          </PrivateRoute>
        ),
      },
      {
        path: "/edit-form-tracer-study/:id",
        element: (
          <PrivateRoute requiredRole="alumni">
            <TracerStudyEditAlumni />
          </PrivateRoute>
        ),
      },
      { path: "/auth/profile", element: <Profile /> },
    ],
  },

  // role "perusahaan"
{
  path: "/",
  element: <DashboardLayout />,
  children: [
      {
          path: "/perusahaan",
          element: (
              <PrivateRoute requiredRole="perusahaan">
                  <DashboardPerusahaan />
              </PrivateRoute>
          ),
      },
      {
          path: "/add-info-loker",
          element: (
              <PrivateRoute requiredRole="perusahaan">
                  <CreateInfoLokerPerusahaan />
              </PrivateRoute>
          ),
      },
      {
          path: "/info_loker",
          element: (
              <PrivateRoute requiredRole="perusahaan">
                  <InfoLokerPerusahaan />
              </PrivateRoute>
          ),
      },
      {
          path: "/detail_info_loker/:id",
          element: (
              <PrivateRoute requiredRole="perusahaan">
                  <DetailInfoLokerPerusahaan />
              </PrivateRoute>
          ),
      },
      {
          path: "/edit_info_loker/:id",
          element: (
              <PrivateRoute requiredRole="perusahaan">
                  <UpdateInfoLokerPerusahaan />
              </PrivateRoute>
          ),
      },
      { path: "/auth/profile", element: <Profile /> },
  ],
},


  // Authentication Routes
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      { path: "404", element: <Error /> },
      { path: "/auth/login", element: <LoginAdmin /> },
      { path: "/auth/register", element: <RegisterAdmin /> },
      { path: "/auth/register/perusahaan", element: <RegisterPerusahaan /> },
      { path: "/auth/login/perusahaan", element: <LoginPerusahaan /> },
      { path: "/auth/forgot-password", element: <ForgotPasswordAdmin /> },
      { path: "/auth/reset-password/:token", element: <ResetPasswordAdmin /> },
      { path: "/auth/forgot-password/perusahaan", element: <ForgotPasswordPerusahaan /> },
      { path: "/auth/reset-password/perusahaan/:token", element: <ResetPasswordPerusahaan /> },
      { path: "/auth/konfirmasi", element: <KonfirmasiGabung/> },

      { path: "*", element: <Navigate to="/auth/404" /> },
    ],
  },
];


export default Router;
