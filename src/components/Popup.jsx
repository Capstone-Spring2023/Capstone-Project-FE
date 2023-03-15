import React, { useState } from "react";
import { Button, Modal } from "antd";
import "./GoogleButton.css";
import { CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { hover } from "@syncfusion/ej2-react-schedule";
import { toast } from "react-hot-toast";

const Popup = ({ title, fetchTable, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    toast.promise(
      fetch("http://localhost:8000/exams/" + id, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      })
        .then((resp) => {
          fetchTable();
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Rejecting...",
        success: <b>Reject successfully</b>,
        error: <b>Reject fail</b>,
      }
    );
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <CloseOutlined
        onClick={showModal}
        style={{ fontSize: 17, color: "red" }}
        height={55}
      />
      <Modal
        centered={true}
        open={isModalOpen}
        title={`${title}`}
        onOk={handleOk}
        onCancel={handleClose}
        footer={[
          <Button
            key="submit"
            type="default"
            onClick={handleOk}
            style={{ color: "green" }}
          >
            Submit
          </Button>,
        ]}
      >
        <TextArea rows={4} />
      </Modal>
    </>
  );
};

export default Popup;
