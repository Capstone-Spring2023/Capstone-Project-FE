import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "./contexts/ContextProvider";

import { Navbar, Sidebar } from "./components";
import {
  Calendar,
  ColorPicker,
  Dashboard,
  Exam,
  Lecturers,
  LoginPage,
} from "./pages";
import "./App.css";

import ExamCreate from "./section/Exam/ExamCreate";
import ExamEdit from "./section/Exam/ExamEdit";

import LecturesCreate from "./section/Lecturers/LecturesCreate";
import LecturersEdit from "./section/Lecturers/LecturesUpdate";
import Spinner from "./components/Spinner";

import Subjects from "./pages/Subjects";
import SubjectCreate from "./section/Subjects/SubjectCreate";
import SubjectEdit from "./section/Subjects/SubjectEdit";

const App = () => {
  const { activeMenu, isLoginPage, setIsLoginPage } = useStateContext();
  // localStorage.clear();
  const bool = JSON.parse(localStorage.getItem("isLogin"));
  const Exams = lazy(() => import("./pages/Exam"));

  console.log("LOGIN", isLoginPage);
  console.log("MENU", activeMenu);
  console.log("BOOL", bool);
  if (bool !== null) {
    console.log("SET", bool);
    setIsLoginPage(bool);
    localStorage.clear();
  }

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);
  const alertUser = (e) => {
    // localStorage.setItem("isLogin", isLoginPage.toString());
    e.preventDefault();
    e.returnValue = "";
  };

  return (
    <BrowserRouter>
      <div className="flex relative dark:bg-main-dark-bg">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <TooltipComponent content="Settings" position="Top">
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
              style={{ background: "blue", borderRadius: "50%" }}
            >
              <FiSettings />
            </button>
          </TooltipComponent>
        </div>
        {activeMenu && isLoginPage ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : (
          <></>
        )}
        <div
          className={
            activeMenu && isLoginPage
              ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full"
              : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2"
          }
        >
          {isLoginPage ? (
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>
          ) : (
            <></>
          )}

          <div>
            <Routes>
              {/*Login*/}
              <Route path="/" element={<LoginPage />} />

              {/*Dashboard*/}
              <Route path="/overview" element={<Dashboard />} />

              {/*Pages*/}

              <Route path="/exam" element={<Exam />} />
              <Route path="/lecturers" element={<Lecturers />} />
              <Route path="/leaders" element="Leader" />
              <Route path="/schedules" element="Schedule" />
              <Route path="/subjects" element={<Subjects/>} />

              {/*Apps*/}
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/color-picker" element={<ColorPicker />} />

              {/*Exams*/}
              <Route path="/exam/create" element={<ExamCreate />} />
              <Route path="/exam/edit/:examid" element={<ExamEdit />} />

              {/*Lectures*/}
              <Route path="/lecturers/create" element={<LecturesCreate />} />
              <Route
                path="/lecturers/edit/:lecturerId"
                element={<LecturersEdit />}
              />

              {/*Subjects*/}
              <Route path="/subjects/create" element={<SubjectCreate />} />
              <Route
                path="/subjects/edit/:subjectId"
                element={<SubjectEdit />}
              />
            </Routes>
          </div>
          {/* <div>
              <Routes>
                <Route path="/login" element={<LoginPage/>}/>
              </Routes>
            </div> */}
        </div>
      </div>
    </BrowserRouter>
  );
};
export default App;
