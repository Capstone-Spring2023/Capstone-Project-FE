import React from "react";
import { overviewData } from "../data/dummy";
import banner from "../assets/banner.png";

const Dashboard = () => {
  return (
    <div className="mt-12">
      <div className="flex flex-wrap lg:flex-nowrap justify-center">
        <div className="bg-blue-200 shadow-md dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-800 p-3 m-3 bg-no-repeat bg-cover bg-center">
          <div className="flex items-center">
            <img
              src={banner}
              alt="Banner"
              style={{ width: 150, height: 150 }}
              className="mr-20"
            />
            <div>
              <p className="font-bold text-black-400">
                Welcome back Mr.Lecturer
              </p>
              <p className="text-gray-400">
                Hope you have a good day to teach and add something here
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-lg font-bold text-start">Summary</div>

      <div className="flex m-3 flex-wrap justify-center gap-14 items-center">
        {overviewData.map((item) => (
          <div
            key={item.title}
            className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56 p-4 pt-9 rounded-2xl shadow-md"
          >
            <button
              type="button"
              style={{ color: item.iconColor, backgroundColor: item.iconBg }}
              className="text-2xl opacity-0.9 rounded-full p-4 hover:drop-shadow-xl"
            >
              {item.icon}
            </button>
            <p className="mt-3">
              <span className="text-lg font-semibold">{item.amount}</span>
              <span className={`text-sm text-${item.pcColor} ml-2`}>
                {item.percentage}
              </span>
            </p>
            <p className="text-sm text-gray-400 mt-1">{item.title}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-10 flex-wrap justify-center">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg m-3 p-4 rounded-2xl md:w-780">
          <div className="flex justify-between">
            <p>Schedule</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
