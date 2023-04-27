import React, { useState } from "react";
import { Button, Descriptions, Modal } from "antd";
import "./GoogleButton.css";
import { InfoOutlined } from "@ant-design/icons";

const ModalAnt2 = ({
  title,
  examScheduleId,
  tittle,
  deadline,
  leaderName,
  subjectName,
  examLink,
  type,
  status,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <InfoOutlined
        onClick={showModal}
        style={{ fontSize: 17, color: "blue" }}
        height={55}
      />
      <Modal
        centered={true}
        open={isModalOpen}
        title={`${title}`}
        onOk={handleOk}
        footer={[
          <Button key="submit" type="default" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <Descriptions layout="vertical">
          <Descriptions.Item label="Subject">{subjectName}</Descriptions.Item>
          {/* <Descriptions.Item label="Assign">{examScheduleId}</Descriptions.Item> */}
          <Descriptions.Item label="Title">{tittle}</Descriptions.Item>
          {/* <Descriptions.Item label="Leader">{leaderName}</Descriptions.Item> */}
          <Descriptions.Item label="Type">
            {type ? "By Computer" : "By Hand"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <span
              className={`inline-flex items-center gap-1 rounded-full ${
                status ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
              }  px-2 py-1 text-xs font-semibold`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status ? "bg-green-600" : "bg-red-600"
                }`}
              ></span>
              {status ? "Active" : "Inactive"}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="Deadline">{deadline}</Descriptions.Item>
          <Descriptions.Item label="Sample Exam Paper">
            <a className="container" href={examLink}>
              <div className="row align-items-center">
                <div className="col-auto">
                  <img
                    src="https://banner2.cleanpng.com/20180611/wc/kisspng-computer-icons-file-explorer-internet-explorer-5b1e670f8e8603.7503591815287191195838.jpg"
                    className="img-thumbnail rounded img-size"
                    alt="Responsive image"
                  />
                </div>
              </div>
            </a>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default ModalAnt2;
