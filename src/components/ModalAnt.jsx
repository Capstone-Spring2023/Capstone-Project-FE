import React, { useState } from "react";
import { Badge, Button, Descriptions, Modal } from "antd";
import './GoogleButton.css';
import { InfoOutlined } from "@ant-design/icons";

const ModalAnt = ({ title }) => {
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
          <Descriptions.Item label="UserName">HoaDNT</Descriptions.Item>
          <Descriptions.Item label="Title">PRF exam</Descriptions.Item>
          <Descriptions.Item label="Content">Content here</Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge status="success" text="Active" />
          </Descriptions.Item>
          <Descriptions.Item label="Type">By computer</Descriptions.Item>
          <Descriptions.Item label="File">
          <a className="container" src="">
            <div className="row align-items-center">
              <div className="col-auto">
                {/* <img src="https://banner2.cleanpng.com/20180611/wc/kisspng-computer-icons-file-explorer-internet-explorer-5b1e670f8e8603.7503591815287191195838.jpg" class="img-thumbnail rounded img-size" alt="Responsive image" /> */}
                <img src="https://www.pngitem.com/pimgs/m/179-1793019_windows-10-file-explorer-icon-hd-png-download.png" class="img-thumbnail rounded img-size" alt="Responsive image" />
              </div>
            </div>
          </a>
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};

export default ModalAnt;
