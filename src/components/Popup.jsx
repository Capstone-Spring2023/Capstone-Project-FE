import React, { useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import "./GoogleButton.css";
import { CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { hover } from "@syncfusion/ej2-react-schedule";
import { toast } from "react-hot-toast";
import {BASE_URL_API} from "../utils/constants";

const Popup = ({ title, fetchTable, examPaperId }) => {
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
        leaderId: 5,
        examPaperId: examPaperId,
        commentContent: commentContent,
        // commentContent: "string",
      },
      examUpdateApproveModel: {
        isApproved: "Reject",
      },
    };
    toast.promise(
      fetch(`https://fpt-cft.azurewebsites.net/api/exam-submission-view/review-exam`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((resp) => {
          return resp;
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Rejecting...",
        success: (data) => `Reject successfully ${data}`,
        error: (err) => `Reject fail ${err}`,
      }
    );
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip title="Reject">
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
          <TextArea
            rows={4}
            value={commentContent}
            onChange={handleCommentChange}
          />
        </Modal>
      </Tooltip>
    </>
  );
};

export default Popup;
