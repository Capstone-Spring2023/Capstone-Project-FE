import React, { lazy, Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "./contexts/ContextProvider";
import useFirebaseMessaging from "@useweb/use-firebase-messaging";

import { Navbar, Sidebar, ThemeSettings } from "./components";
import {
  Calendar,
  ColorPicker,
  Leaders,
  LoginPage,
  RegisterClass,
} from "./pages";
import "./App.css";

import ExamSubmissionCreate from "./section/ExamSubmission/ExamSubmissionCreate";
import ExamSubmissionEdit from "./section/ExamSubmission/ExamSubmissionEdit";

import LecturesCreate from "./section/Lecturers/LecturesCreate";
import LecturersEdit from "./section/Lecturers/LecturesUpdate";
import { onMessageListener } from "./firebase/firebase";
import NotiFirebase from "./components/NotiFirebase";
import NotiPopup from "./components/NotiPopup";
import ExamScheduleCreate from "./section/ExamSchedule/ExamScheduleCreate";
import ExamScheduleEdit from "./section/ExamSchedule/ExamScheduleEdit";
import ExamSubmissionView from "./pages/ExamSubmissionView";

import RegisterClass_Register from "./section/RegisterClass/RegisterClass_Register";

import Subjects from "./pages/Subjects";
import SubjectCreate from "./section/Subjects/SubjectCreate";
import SubjectEdit from "./section/Subjects/SubjectEdit";
import Spinner from "./components/Spinner";
import Firebase from "./pages/Firebase";
import { toast } from "react-toastify";
import TextArea from "antd/lib/input/TextArea";

const App = () => {
  const {
    activeMenu,
    isLoginPage,
    setIsLoginPage,
    setActiveMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    currentMode,
  } = useStateContext();
  const ExamsSubmission = lazy(() => import("./pages/ExamSubmission"));
  const ExamsSchedule = lazy(() => import("./pages/ExamSchedule"));
  const ExamsScheduleView = lazy(() => import("./pages/ExamScheduleView"));
  const ExamsSubmissionView = lazy(() => import("./pages/ExamSubmissionView"));
  const DashboardLazy = lazy(() => import("./pages/Dashboard"));
  const [notification, setNotification] = useState({ title: "", body: "" });
  const [show, setShow] = useState(false);
  const isLogin = JSON.parse(localStorage.getItem("isLogin"));
  const isActiveMenu = JSON.parse(localStorage.getItem("isActiveMenu"));

  useEffect(() => {
    if (isLogin != null && isActiveMenu != null) {
      setIsLoginPage(isLogin);
      setActiveMenu(isActiveMenu);
      console.log("isLogin", isLogin);
      console.log("isActiveMenu", isActiveMenu);
    }
  }, [isLoginPage, activeMenu]);

  // onMessageListener()
  //   .then((payload) => {
  //     // console.log("LISTEN", show);
  //     setShow(true);
  //     setNotification({
  //       title: payload?.notification?.title,
  //       body: payload?.notification?.body,
  //     });
  //   })
  //   .catch((err) => console.log("failed: ", err));

  const firebaseMessaging = useFirebaseMessaging({
    onMessage: (message) => {
      console.log(`Received foreground message`, message);
      toast.show({
        message: message?.notification?.title || message?.data?.title,
      });
    },
  });

  useEffect(() => {
    firebaseMessaging.init();
  }, []);

  return (
    <Firebase>
      <div className={currentMode === "Dark" ? "dark" : ""}>
        <BrowserRouter>
          <div className="flex relative dark:bg-main-dark-bg">
            <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
              <TooltipComponent content="Settings" position="Top">
                <button
                  type="button"
                  className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
                  style={{ background: currentColor, borderRadius: "50%" }}
                  onClick={() => setThemeSettings(true)}
                >
                  <FiSettings />
                </button>
              </TooltipComponent>
            </div>
            {activeMenu && !isLoginPage ? (
              <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
                <Sidebar />
              </div>
            ) : (
              <></>
            )}
            <div
              className={
                activeMenu && !isLoginPage
                  ? "dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full"
                  : "bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2"
              }
            >
              {activeMenu && !isLoginPage ? (
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
                  <Navbar />
                </div>
              ) : (
                <></>
              )}

              <div>
                {themeSettings && <ThemeSettings />}

                <p>{firebaseMessaging.fcmRegistrationToken}</p>
                <Suspense fallback={<Spinner />}>
                  <Routes>
                    {/*Login*/}
                    <Route path="/" element={<LoginPage />} />

                    {/*Dashboard*/}
                    <Route
                      path="/overview"
                      element={
                        <>
                          {/*<NotiFirebase />*/}
                          <DashboardLazy />
                          {/*{show ? (*/}
                          {/*  <NotiPopup*/}
                          {/*    title={notification.title}*/}
                          {/*    body={notification.body}*/}
                          {/*  />*/}
                          {/*) : (*/}
                          {/*  <></>*/}
                          {/*)}*/}
                        </>
                      }
                    />

                  {/*Pages*/}
                  <Route
                    path="/exam-submission"
                    element={<ExamsSubmission />}
                  />
                  <Route path="/exam-schedule" element={<ExamsSchedule />} />
                  <Route path="/exam-schedule-view" element={<ExamsScheduleView />} />
                  <Route
                    path="/exam-submission-view"
                    element={<ExamSubmissionView />}
                  />
                  <Route path="/leaders" element={<Leaders />} />
                  <Route path="/schedules" element="Schedule" />
                  <Route path="/subjects" element={<Subjects />} />

                    {/*Apps*/}
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/color-picker" element={<ColorPicker />} />
                    <Route path="/register-class" element={<RegisterClass />} />
                    <Route
                      path="/register-class/register"
                      element={<RegisterClass_Register />}
                    />

                    {/*Exams Submission*/}
                    <Route
                      path="/exam/submission/create"
                      element={<ExamSubmissionCreate />}
                    />
                    <Route
                      path="/exam/submission/edit/:examPaperId"
                      element={<ExamSubmissionEdit />}
                    />

                    {/*Exams Schedule*/}
                    <Route
                      path="/exam/schedule/create"
                      element={<ExamScheduleCreate />}
                    />
                    <Route
                      path="/exam/schedule/edit/:examScheduleId"
                      element={<ExamScheduleEdit />}
                    />

                    {/*Lectures*/}
                    <Route
                      path="/lecturers/create"
                      element={<LecturesCreate />}
                    />
                    <Route
                      path="/lecturers/edit/:lecturerId"
                      element={<LecturersEdit />}
                    />

                    {/*Subjects*/}
                    <Route
                      path="/subjects/create"
                      element={<SubjectCreate />}
                    />
                    <Route
                      path="/subjects/edit/:subjectId"
                      element={<SubjectEdit />}
                    />
                  </Routes>
                </Suspense>
              </div>
            </div>
          </div>
        </BrowserRouter>
      </div>
    </Firebase>
  );
};
export default App;
