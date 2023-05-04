import React, { useEffect, useState } from "react";
import { overviewData } from "../data/dummy";
import banner from "../assets/banner.png";
import { useStateContext } from "../contexts/ContextProvider";
import { BASE_URL_API } from "../utils/constants";
import { MdOutlineSupervisorAccount } from "react-icons/md";
import { HiOutlineRefresh } from "react-icons/hi";

const Dashboard = () => {
  const { currentColor } = useStateContext();
  const fullName = sessionStorage.getItem("fullName");
  const [totalExam,setTotalExam]=useState("");
  const fetchSubject = () => {
    fetch(
      `${BASE_URL_API}/statistic/StatisticalForLecturerOrLeader/${sessionStorage.getItem(
        "userId"
      )}?semesterId=0`
    )
      .then((res) => {
        return res.json();
      })
      .then((resp) => {
        setTotalExam(resp);
        console.log(resp)
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  
  useEffect(() => {
    fetchSubject();
  }, []);

  return (
    <div className="mt-12 flex flex-col items-center">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div
          className="shadow-md dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-800 p-3 m-3 bg-no-repeat bg-cover bg-center"
          style={{ backgroundColor: currentColor }}
        >
          <div className="flex items-center">
            <img
              src={banner}
              alt="Banner"
              style={{ width: 250, height: 150, objectFit: "cover" }}
              className="mr-20"
            />
            <div>
              <p className="font-bold text-black-400 text-2xl">
                Welcome back {fullName}
              </p>
              <p className="text-gray-600">
                Hope you have a wonderfully day with your class
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="text-lg font-bold">Summary</div>
      {sessionStorage.getItem("roleName")!== "Header"?( 
      <div className="flex m-3 flex-wrap justify-center gap-14 items-center">
        <div
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-md"
          >
            <button
              type="button"
              style={{ color: "blue", backgroundColor: "yellow" }}
              className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
            >
              {/* {item.icon} */}
              <MdOutlineSupervisorAccount />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalExam.totalExamNeedApprove}</span>
              <span className={`text-sm text-white ml-2`}>
                {totalExam.totalExamNeedApprove}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Exam Need Approve</p>
          </div>
          <div
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-md"
          >
            <button
              type="button"
              style={{ color: "blue", backgroundColor: "yellow" }}
              className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
            >
              {/* {item.icon} */}
              <HiOutlineRefresh />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalExam.totalExamNeedSubmit}</span>
              <span className={`text-sm text-white ml-2`}>
                {totalExam.totalExamNeedSubmit}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Exam Need Submit</p>
          </div>
          <div
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-md"
          >
            <button
              type="button"
              style={{ color: "blue", backgroundColor: "yellow" }}
              className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
            >
              {/* {item.icon} */}
              <HiOutlineRefresh />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalExam.totalClassTeaching}</span>
              <span className={`text-sm text-white ml-2`}>
                {totalExam.totalClassTeaching}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Class Teaching</p>
          </div>
      </div>
      ) : null}
      {sessionStorage.getItem("roleName")=== "Header"?( 
      <div className="flex m-3 flex-wrap justify-center gap-14 items-center">
        <div
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-md"
          >
            <button
              type="button"
              style={{ color: "rgb(255, 244, 229)", backgroundColor: "rgb(254, 201, 15)" }}
              className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
            >
              {/* {item.icon} */}
              <MdOutlineSupervisorAccount />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalExam.totalExamNeedSubmittedOfHeader}</span>
              <span className={`text-sm text-white ml-2`}>
                {totalExam.totalExamNeedSubmittedOfHeader}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Exam Need Submitted Of Header</p>
          </div>
          <div
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-md"
          >
            <button
              type="button"
              style={{ color: "rgb(0, 194, 146)", backgroundColor: "rgb(235, 250, 242)" }}
              className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
            >
              {/* {item.icon} */}
              <HiOutlineRefresh />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalExam.totalExamNotSubmitOfTeacher}</span>
              <span className={`text-sm text-white ml-2`}>
                {totalExam.totalExamNotSubmitOfTeacher}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Exam Not Submit Of Teacher</p>
          </div>
          <div
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-md"
          >
            <button
              type="button"
              style={{ color: "rgb(0, 194, 146)", backgroundColor: "rgb(235, 250, 242)" }}
              className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
            >
              {/* {item.icon} */}
              <HiOutlineRefresh />
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{totalExam.totalExamNeedSubmittedOfTeacher}</span>
              {/* <span className={`text-sm text-rgb(0, 194, 146) ml-2`}>
                {totalExam.totalExamNeedSubmittedOfTeacher}
              </span> */}
            </p>
            <p className="text-sm text-gray-400 mt-1">Total Exam Need Submitted Of Teacher</p>
          </div>
      </div>
      ) : null}
    </div>
  );
};

export default Dashboard;
