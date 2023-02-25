import React from "react";
import {toast, ToastContainer} from "react-toastify";

const NotiPopup = ({ title, body }) => {
  let hideNoti = title === "";

  if (!hideNoti) {
    toast.info(
      <div>
        <h4>{title}</h4>
        <p>{body}</p>
      </div>
    );
  }

  return (
    <ToastContainer
      autoClose={3000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
    />
  );
};

export default NotiPopup;
