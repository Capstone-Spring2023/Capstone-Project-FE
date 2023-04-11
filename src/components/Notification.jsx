import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import avatar4 from "../assets/banner.jpg";
import { useNavigate } from "react-router-dom";
import { Empty } from "antd";

const Notification = ({ notiData }) => {
  const navigate = useNavigate();

  return (
    <div>
      {notiData?.length > 0 ? (
        notiData?.map((item, index) => (
          <div
            key={index}
            className="flex items-center leading-8 gap-5 border-color p-3 cursor-pointer hover:bg-light-gray rounded-lg"
            onClick={() =>
              navigate("/exam-schedule-view", { state: { subject: item?.subjectCode } })
            }
          >
            <img
              className="rounded-full h-10 w-10"
              src={avatar4}
              alt={item.name}
            />
            <div>
              <p className="font-semibold dark:text-gray-200">
                You have new {item.type} request
              </p>
              <p className="text-gray-500 text-sm dark:text-gray-400">
                {"for "}
                {item.subjectCode}{" "}
                {"from "}
                {item.sender}{" "}
              </p>
            </div>
          </div>
        ))
      ) : (
        <Empty description="No notification" />
      )}
    </div>
  );
};

export default Notification;
