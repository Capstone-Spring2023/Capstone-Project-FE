import React, { useState } from "react";
import { Badge, Button, Descriptions, Modal } from "antd";
import "./GoogleButton.css";
import { InfoOutlined } from "@ant-design/icons";

const ModalAnt4 = ({title, fullName, subjectName, semester }) => {
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
                        Set Leader
                    </Button>,
                ]}
            >
                <Descriptions layout="vertical">
                    <Descriptions.Item label="Subject">{subjectName}</Descriptions.Item>
                    <Descriptions.Item label="Full Name">{fullName}</Descriptions.Item>
                    <Descriptions.Item label="Semester">{semester}</Descriptions.Item>
                </Descriptions>
            </Modal>
        </>
    );
};

export default ModalAnt4;
