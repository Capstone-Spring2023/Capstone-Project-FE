import React, { useState } from "react";
import { Badge, Button, Descriptions, Modal } from "antd";
import { InfoOutlined } from "@ant-design/icons";

const ModalAnt = ({ title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
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
        onCancel={handleCancel}
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
        </Descriptions>
      </Modal>
    </>
  );
};

export default ModalAnt;
