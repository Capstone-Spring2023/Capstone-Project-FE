import React, { useEffect, useState } from "react";
import { Button, DatePicker, Descriptions, message, Modal, Select } from "antd";
import "./GoogleButton.css";
import moment from "moment";
import { BASE_URL_API } from "../utils/constants";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { Option } = Select;
const ModalAnt6 = ({
  title,
  classId,
  userId,
  isModalOpen,
  setIsModalOpen,
  fetchSchedule
}) => {
  const navigate = useNavigate();

  const handleOk2 = () => {
    setIsModalOpen(false);
  };

  const handleConfirmSave = () => {
    const examData = {
      classId: classId,
      userId: userId,
    };
    toast.promise(
      fetch(`${BASE_URL_API}/schedule/lecturer`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(examData),
      })
        .then((res) => {
          console.log(res);
          fetchSchedule();
          setIsModalOpen(false);
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Creating...",
        success: <b>Change successfully</b>,
        error: <b>Could not change.</b>,
      }
    );
  };
  

  return (
    <>
      <Modal
        title="Warning"
        onCancel={handleOk2}
        footer={[
          <Button
            className="save-button987"
            key="cancel"
            onClick={handleOk2}
          >
            Cancel
          </Button>,
          <Button
            className="save-button987"
            key="ok"
            type="primary"
            onClick={handleConfirmSave}
          >
            OK
          </Button>,
        ]}
        visible={isModalOpen}
      >
        <p>Are you sure you want to save?</p>
      </Modal>
    </>
  );
};

export default ModalAnt6;