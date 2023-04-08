import React, { useState } from "react";
import { Badge, Button, Descriptions, Modal } from "antd";
import "./GoogleButton.css";
import { InfoOutlined } from "@ant-design/icons";

const ModalAnt5 = ({
    title,
    scheduleId,
    slot,
    scheduleDate,
    classCode,
    classId,
    isModalOpen,
    setIsModalOpen,
}) => {
    const handleOk = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <Modal
                centered={true}
                visible={isModalOpen}
                title={`${title}`}
                onCancel={handleOk}
                footer={[
                    <Button key="submit" type="default" onClick={handleOk}>
                        OK
                    </Button>,
                ]}
            >
                <Descriptions layout="vertical">
                    {/* <Descriptions.Item label="Schedule Id">{scheduleId}</Descriptions.Item> */}
                    <Descriptions.Item label="Slot">{slot}</Descriptions.Item>
                    <Descriptions.Item label="Schedule Date">{scheduleDate}</Descriptions.Item>
                    {/* <Descriptions.Item label="Schedule Code">{classCode}</Descriptions.Item> */}
                    <Descriptions.Item label="Subject">
                    {classCode && classCode.split("_")[0]}
                    </Descriptions.Item>
                    <Descriptions.Item label="Class">
                    {classCode && classCode.split("_")[1]}
                    </Descriptions.Item>
                    {/* <Descriptions.Item label="Class ID">{classId}</Descriptions.Item> */}
                </Descriptions>
            </Modal>
        </>
    );
};



export default ModalAnt5;
