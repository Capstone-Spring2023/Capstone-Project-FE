import React from "react";
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

const App = () => {
  const { activeMenu, isLoginPage } = useStateContext();
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
              ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full"
              : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2"
          }
        >
          {!isLoginPage ? (
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
              <Route path="/subjects" element="Subjects" />

              {/*Apps*/}
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/color-picker" element={<ColorPicker />} />

              {/*Exams*/}
              <Route path="/exam/create" element={<ExamCreate />} />
              <Route path="/exam/edit/:examid" element={<ExamEdit />} />
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
