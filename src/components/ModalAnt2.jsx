import React, { useState } from "react";
import { Badge, Button, Descriptions, Modal } from "antd";
import "./GoogleButton.css";
import { InfoOutlined } from "@ant-design/icons";

const ModalAnt2 = ({ title }) => {
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
          <Descriptions.Item label="Assign">HoaDNT</Descriptions.Item>
          <Descriptions.Item label="Title">PRF exam</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge status="success" text="Active" />
          </Descriptions.Item>
          <Descriptions.Item label="Deadline">2023-02-22</Descriptions.Item>
          <Descriptions.Item label="Sample Topic">
          <a className="container" href="https://firebasestorage.googleapis.com/v0/b/capstone-cft.appspot.com/o/H%C6%AF%E1%BB%9ANG-D%E1%BA%AAN-T%E1%BA%A0O-%C4%90%E1%BB%80-THI-PE-M%C3%94N-PRJ301.docx?alt=media&token=ca12d3f1-4e06-414b-b13f-1a7724144a2c">
            <div className="row align-items-center">
              <div className="col-auto">
                <img src="https://banner2.cleanpng.com/20180611/wc/kisspng-computer-icons-file-explorer-internet-explorer-5b1e670f8e8603.7503591815287191195838.jpg" class="img-thumbnail rounded img-size" alt="Responsive image" />
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
