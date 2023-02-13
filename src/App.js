import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { useStateContext } from "./contexts/ContextProvider";

import { Navbar, Sidebar, ThemeSettings } from "./components";
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
  const isLogin = JSON.parse(localStorage.getItem("isLogin"));
  const isActiveMenu = JSON.parse(localStorage.getItem("isActiveMenu"));
  const Exams = lazy(() => import("./pages/Exam"));
  const DashboardLazy = lazy(() => import("./pages/Dashboard"));

  if (isLogin !== null && isActiveMenu !== null) {
    setIsLoginPage(isLogin);
    setActiveMenu(isActiveMenu);
  }

  return (
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
              <Suspense fallback={<Spinner />}>
                <Routes>
                  {/*Login*/}
                  <Route path="/" element={<LoginPage />} />

                  {/*Dashboard*/}
                  <Route
                    path="/overview"
                    element={
                      <Suspense fallback={<Spinner />}>
                        <DashboardLazy />
                      </Suspense>
                    }
                  />

                  {/*Pages*/}

                  <Route
                    path="/exam"
                    element={
                      <Suspense fallback={<Spinner />}>
                        <Exams />
                      </Suspense>
                    }
                  />
                  <Route path="/lecturers" element={<Lecturers />} />
                  <Route path="/leaders" element="Leader" />
                  <Route path="/schedules" element="Schedule" />
                  <Route path="/subjects" element="Subjects" />

                  {/*Apps*/}
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/color-picker" element={<ColorPicker />} />

                  {/*Exams*/}
                  <Route path="/exam/create" element={<ExamCreate />} />
                  <Route path="/exam/edit/:examid" element={<ExamEdit />} />

                  {/*Lectures*/}
                  <Route
                    path="/lecturers/create"
                    element={<LecturesCreate />}
                  />
                  <Route
                    path="/lecturers/edit/:lecturerId"
                    element={<LecturersEdit />}
                  />
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};
export default App;
