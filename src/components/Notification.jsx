import React from "react";
import avatar4 from "../assets/banner.jpg";
import { useNavigate } from "react-router-dom";
import { Empty } from "antd";
import { BASE_URL_API } from "../utils/constants";
import { it } from "date-fns/locale";

const Notification = ({ fetchNoti, notiData }) => {
  const navigate = useNavigate();
  const handleNotiClick = (notiId, subjectCode, type) => {
    fetch(`${BASE_URL_API}/Notifications/` + notiId, {
      method: "PUT",
      headers: { "content-type": "application/json" },
    })
      .then(() => {
        fetchNoti();
        type === "Schedule"
          ? navigate("/exam-schedule-request", {
              state: { subject: subjectCode },
            })
          : type === "subjectLead"
          ? navigate("/exam-schedule")
          : navigate("/exam-submission-view", {
              state: { subject: subjectCode },
            });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const notiCondition = (type, item) => {
    switch (type) {
      case "subjectLead":
        return (
          <div>
            You have new notification from {item.sender}
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {item.message}
            </p>
          </div>
        );
      case "Schedule":
        return (
          <div>
            You have new notification from {item.sender}
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {item.message}
              {" for "}
              {item.subjectCode}
            </p>
          </div>
        );
      case "schedule":
        return (
          <div>
            You have new notification
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {item.message}
            </p>
          </div>
        );
      case "Submission":
        return (
          <div>
            You have new notification
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {item.sender} {item.message} {item.subjectCode}
            </p>
          </div>
        );
      case "Reject":
        return (
          <div>
            You have new notification from {item.sender}
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {item.message}
              {" for "}
              {item.subjectCode}
            </p>
          </div>
        );
      case "Appprove":
        return (
          <div>
            You have new notification from {item.sender}
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {item.message}
              {" for "}
              {item.subjectCode}
            </p>
          </div>
        );
      case "Instruction":
        return (
          <div>
            You have new notification from {item.sender}
            <p className="text-gray-500 text-sm dark:text-gray-400">
              {item.message}
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {notiData?.length > 0 ? (
        notiData?.map((item, index) => (
          <div
            key={index}
            className="flex items-center leading-8 gap-5 border-color p-3 cursor-pointer hover:bg-light-gray rounded-lg"
            onClick={() =>
              handleNotiClick(item?.notiId, item?.subjectCode, item?.type)
            }
          >
            <img
              className="rounded-full h-10 w-10"
              src={avatar4}
              alt={item.name}
            />
            <div>
              <p className="font-semibold dark:text-gray-200">
                {notiCondition(item.type, item)}
              </p>
            </div>
            <div className="text-gray-500">{item.status}</div>
          </div>
        ))
      ) : (
        <Empty description="No notification" />
      )}
    </div>
  );
};

export default Notification;
