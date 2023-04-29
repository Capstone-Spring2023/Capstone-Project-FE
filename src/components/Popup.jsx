import React, { useState } from "react";
import { Button, Modal, Tooltip } from "antd";
import "./GoogleButton.css";
import { CloseOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { toast } from "react-hot-toast";
import { BASE_URL_API, REJECTED } from "../utils/constants";
import { ref, deleteObject, listAll } from "@firebase/storage";
import { storage } from "../firebase/firebase";
import { dataChange } from "../utils/function";

const Popup = ({
  title,
  fetchTable,
  examPaperId,
  examLink,
  subjectName,
  socket,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const handleCommentChange = (event) => {
    setCommentContent(event.target.value);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const deleteFile = () => {
    let folderRef = ref(storage, `/SP23/${examLink}/${subjectName.trim()}/PE1`);
    listAll(folderRef).then((res) => {
      if (res.items.length > 0) {
        const promises = [];
        res.items.forEach((itemRef) => {
          promises.push(deleteObject(itemRef));
        });
        Promise.all(promises)
          .then(() => {
            console.log("All files deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting files:", error);
          });
      }
    });
  };
  const deleteFile2 = () => {
    let folderRef = ref(
      storage,
      `/SP23/${examLink}/${subjectName.trim()}/PE1/Given`
    );
    listAll(folderRef).then((res) => {
      if (res.items.length > 0) {
        const promises = [];
        res.items.forEach((itemRef) => {
          promises.push(deleteObject(itemRef));
        });
        Promise.all(promises)
          .then(() => {
            console.log("All files Given deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting files:", error);
          });
      }
    });
  };
  const deleteFile3 = () => {
    let folderRef = ref(
      storage,
      `/SP23/${examLink}/${subjectName.trim()}/PE1/TestCases`
    );
    listAll(folderRef).then((res) => {
      if (res.items.length > 0) {
        const promises = [];
        res.items.forEach((itemRef) => {
          promises.push(deleteObject(itemRef));
        });
        Promise.all(promises)
          .then(() => {
            console.log("All files TestCases deleted successfully");
          })
          .catch((error) => {
            console.error("Error deleting files:", error);
          });
      }
    });
  };

  const handleOk = () => {
    deleteFile();
    deleteFile2();
    deleteFile3();
    setIsModalOpen(false);
    const data = {
      commentModel: {
        leaderId: 5,
        approvalUserId: sessionStorage.getItem("userId"),
        examPaperId: examPaperId,
        commentContent: commentContent,
      },
      examUpdateApproveModel: {
        status: REJECTED,
      },
    };
    toast.promise(
      fetch(`${BASE_URL_API}/exam-submission-view/review-exam`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((resp) => {
          dataChange(socket);
          fetchTable();
          return resp;
        })
        .catch((err) => {
          console.log(err.message);
        }),
      {
        loading: "Rejecting...",
        success: (data) => `Reject successfully`,
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
