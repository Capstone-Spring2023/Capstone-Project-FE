import React from "react";
import avatar4 from "../assets/banner.jpg";
import { useNavigate } from "react-router-dom";
import { Empty } from "antd";
import { BASE_URL_API } from "../utils/constants";

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
                {item.type === "subjectLead" ? (
                  <div>
                    You have new Noti from {item.sender}
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                      {item.message}
                    </p>
                  </div>
                ) : (
                  <div>
                    You have new {item.type} notification
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                      {"from "}
                      {item.sender} {"for "}
                      {item.subjectCode}
                    </p>
                  </div>
                )}
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
