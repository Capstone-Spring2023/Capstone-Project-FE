import React from "react";
import { overviewData } from "../data/dummy";
import banner from "../assets/banner.png";
import { useStateContext } from "../contexts/ContextProvider";

const Dashboard = () => {
  const { currentColor } = useStateContext();
  const fullName = sessionStorage.getItem("fullName");
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
    </div>
  );
};

export default Dashboard;
