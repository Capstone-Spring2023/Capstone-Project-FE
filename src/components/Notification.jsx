import React from "react";
import { useStateContext } from "../contexts/ContextProvider";
import { Button } from "./index";
import avatar4 from "../assets/avatar4.jpg";
import { useNavigate } from "react-router-dom";

const Notification = ({ notiData }) => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();

  return (
    <div>
      {notiData?.map((item, index) => (
        <div
          key={index}
          className="flex items-center leading-8 gap-5 border-b-1 border-color p-3"
          onClick={() => navigate("/exam-schedule-view")}
        >
          <img
            className="rounded-full h-10 w-10"
            src={avatar4}
            alt={item.name}
          />
          <div>
            <p className="font-semibold dark:text-gray-200">{item.text}</p>
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {"from "}
              {item.name}{" "}
            </p>
          </div>
        </div>
      ))}
      <div className="mt-5">
        <Button
          color="white"
          bgColor={currentColor}
          text="See all notifications"
          borderRadius="10px"
          width="full"
        />
      </div>
    </div>
  );
};

export default Notification;
