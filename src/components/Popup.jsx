import React, { useState } from "react";
import { Button, Modal } from "antd";
import "./GoogleButton.css";
import { CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { hover } from "@syncfusion/ej2-react-schedule";
import { toast } from "react-hot-toast";

const Popup = ({ title, fetchTable, id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
const handleCommentChange = (event) => {
  setCommentContent(event.target.value);
};
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    const data = {
      commentModel: {
        leaderId: 2,
        examPaperId: id,
        // commentContent: commentContent
        commentContent: "string"
      },
      examUpdateApproveModel: {
        isApproved: false
      }
    };
    toast.promise(
      fetch("https://fpt-cft.azurewebsites.net/v1/api/exams/review-exam", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then((resp) => {
          fetchTable();
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Approving...",
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
        <TextArea rows={4} value={commentContent} onChange={handleCommentChange}/>
      </Modal>
    </>
  );
};

export default Popup;
